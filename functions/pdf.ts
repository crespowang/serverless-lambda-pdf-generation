import middy from "middy";
import wkhtmltopdf from "wkhtmltopdf";
import {
  cors,
  doNotWaitForEmptyEventLoop,
  httpErrorHandler
} from "middy/middlewares";

process.env["PATH"] =
  process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

const getPDFStream = async (): Promise<any> => {
  const stream: any = wkhtmltopdf("hello world");
  const chunks = [];
  stream.on("data", chunk => {
    chunks.push(chunk);
  });
  return new Promise((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
const handler = async event => {
  try {
    const pdfStream = await getPDFStream();
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-type": "application/pdf",
        "accept-ranges": "bytes"
      },
      body: pdfStream.toString("base64")
    };
  } catch (error) {
    console.log(error);
  }
};

export const generate = middy(handler)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
