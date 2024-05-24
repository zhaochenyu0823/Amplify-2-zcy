import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);
  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173/", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "Content-Type", // Specify only the headers you need to allow
    },
    body: JSON.stringify("Hello from zcy-api-function!"),
  };
};