import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import torch
import torchvision.models as models
import torch.nn as nn
from PIL import Image
from flask import Flask, request, jsonify
import torch
import torchvision.transforms as transforms
from PIL import Image
import torch.nn.functional as F

# Define the ConvBlock class here
class ConvBlock(nn.Module):
    # Convolution Block with Conv2d layer, Batch Normalization and ReLU. Act is an activation function.
    def __init__(
          self,
          in_channels : int,
          out_channels : int,
          kernel_size : int,
          stride : int,
          act = nn.ReLU(),
          groups = 1,
          bn = True,
          bias = False
        ):
        super().__init__()

        # If k = 1 -> p = 0, k = 3 -> p = 1, k = 5, p = 2.
        padding = kernel_size // 2
        self.c = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, groups=groups, bias=bias)
        self.bn = nn.BatchNorm2d(out_channels) if bn else nn.Identity()
        self.act = act

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.act(self.bn(self.c(x)))

class SeBlock(nn.Module):
    # Squeeze and Excitation Block.
    def __init__(
        self,
        in_channels : int
        ):
        super().__init__()

        C = in_channels
        r = C // 4
        self.globpool = nn.AdaptiveAvgPool2d((1,1))
        self.fc1 = nn.Linear(C, r, bias=False)
        self.fc2 = nn.Linear(r, C, bias=False)
        self.relu = nn.ReLU()
        self.hsigmoid = nn.Hardsigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: [N, C, H, W].
        f = self.globpool(x)
        f = torch.flatten(f,1)
        f = self.relu(self.fc1(f))
        f = self.hsigmoid(self.fc2(f))
        f = f[:,:,None,None]
        # f shape: [N, C, 1, 1]

        scale = x * f
        return scale

# Define the BNeck class here
class BNeck(nn.Module):
    # MobileNetV3 Block
    def __init__(
        self,
        in_channels : int,
        out_channels : int,
        kernel_size : int,
        exp_size : int,
        se : bool,
        act : torch.nn.modules.activation,
        stride : int
        ):
        super().__init__()

        self.add = in_channels == out_channels and stride == 1

        self.block = nn.Sequential(
            ConvBlock(in_channels, exp_size, 1, 1, act),
            ConvBlock(exp_size, exp_size, kernel_size, stride, act, exp_size),
            SeBlock(exp_size) if se == True else nn.Identity(),
            ConvBlock(exp_size, out_channels, 1, 1, act=nn.Identity())
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        res = self.block(x)
        if self.add:
            res = res + x

        return res

# Define the MobileNetV3 class here
class MobileNetV3(nn.Module):
    def __init__(
        self,
        config_name : str,
        in_channels = 3,
        classes = 2
        ):
        super().__init__()
        config = self.config(config_name)

        # First convolution(conv2d) layer.
        self.conv = ConvBlock(in_channels, 16, 3, 2, nn.Hardswish())
        # Bneck blocks in a list.
        self.blocks = nn.ModuleList([])
        for c in config:
            kernel_size, exp_size, in_channels, out_channels, se, nl, s = c
            self.blocks.append(BNeck(in_channels, out_channels, kernel_size, exp_size, se, nl, s))

        # Classifier
        last_outchannel = config[-1][3]
        last_exp = config[-1][1]
        out = 1280 if config_name == "large" else 1024
        self.classifier = nn.Sequential(
            ConvBlock(last_outchannel, last_exp, 1, 1, nn.Hardswish()),
            nn.AdaptiveAvgPool2d((1,1)),
            ConvBlock(last_exp, out, 1, 1, nn.Hardswish(), bn=False, bias=True),
            nn.Dropout(0.8),
            nn.Conv2d(out, classes, 1, 1)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.conv(x)
        for block in self.blocks:
            x = block(x)

        x = self.classifier(x)
        return torch.flatten(x, 1)

    def config(self, name):
        HE, RE = nn.Hardswish(), nn.ReLU()
        # [kernel, exp size, in_channels, out_channels, SEBlock(SE), activation function(NL), stride(s)]
        large = [
                [3, 16, 16, 16, False, RE, 1],
                [3, 64, 16, 24, False, RE, 2],
                [3, 72, 24, 24, False, RE, 1],
                [5, 72, 24, 40, True, RE, 2],
                [5, 120, 40, 40, True, RE, 1],
                [5, 120, 40, 40, True, RE, 1],
                [3, 240, 40, 80, False, HE, 2],
                [3, 200, 80, 80, False, HE, 1],
                [3, 184, 80, 80, False, HE, 1],
                [3, 184, 80, 80, False, HE, 1],
                [3, 480, 80, 112, True, HE, 1],
                [3, 672, 112, 112, True, HE, 1],
                [5, 672, 112, 160, True, HE, 2],
                [5, 960, 160, 160, True, HE, 1],
                [5, 960, 160, 160, True, HE, 1]
        ]

        small = [
                [3, 16, 16, 16, True, RE, 2],
                [3, 72, 16, 24, False, RE, 2],
                [3, 88, 24, 24, False, RE, 1],
                [5, 96, 24, 40, True, HE, 2],
                [5, 240, 40, 40, True, HE, 1],
                [5, 240, 40, 40, True, HE, 1],
                [5, 120, 40, 48, True, HE, 1],
                [5, 144, 48, 48, True, HE, 1],
                [5, 288, 48, 96, True, HE, 2],
                [5, 576, 96, 96, True, HE, 1],
                [5, 576, 96, 96, True, HE, 1]
        ]

        if name == "large": return large
        if name == "small": return small

if __name__ == "__main__":
    name = "large"
    rho = 1
    res = int(rho * 224)

    net = MobileNetV3(name)
    print(net(torch.rand(1, 3, res, res)).shape)

app = Flask(__name__)
CORS(app)

# Load the model
model_save_path = 'Mobilenet_V3_5epochs.pth'
checkpoint_exists = os.path.isfile(model_save_path)

# Initializing the model
model = MobileNetV3(config_name="small") # Adjust the config_name as needed

if checkpoint_exists:
    checkpoint = torch.load(model_save_path)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
else:
    print("Model checkpoint not found.")
    # Handle the case where the model checkpoint is not found
    
@app.route('/predict', methods=['POST'])
def predict():
    try:
        imagefile = request.files['imagefile']
        image_path = os.path.join('images', imagefile.filename)
        imagefile.save(image_path)
        print(f"Saved image to: {image_path}") # Debugging line
        
        image = Image.open(image_path)
        image = image.resize((224, 224)) # Resize to match the model's expected input size
        image = np.array(image) # Convert to numpy array
        image = image.transpose((2, 0, 1)) # Change data layout from HWC to CHW
        image = np.expand_dims(image, axis=0) # Add batch dimension
        image = image / 255.0 # Normalize to [0, 1]
        image = torch.from_numpy(image).float() # Convert to PyTorch tensor

        # Make a prediction
        with torch.no_grad():
            outputs = model(image)
            probabilities = F.softmax(outputs, dim=1)
            print(probabilities)
            _, preds = torch.max(probabilities, 1)

        # Define class names
        class_names = ['Not Autistic', 'Autistic']

        # Predicted class name
        predicted_class = class_names[preds.item()]

        # Return the prediction as JSON
        return jsonify({'prediction': predicted_class, 'probabilities': probabilities.tolist()})

    except Exception as e:        
        return jsonify({'error': str(e)}), 500 
    
        # return render_template('index.html', prediction=predicted_class_name)

if __name__ == '__main__':
       app.run(port=3000,debug=True)
