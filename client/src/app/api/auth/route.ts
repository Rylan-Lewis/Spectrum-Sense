export async function GET(request: Request){
  console.log("WORKING");
  
  return new Response('hi')
}