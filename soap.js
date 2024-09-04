const http = require("http");
const xml2js = require("xml2js");
const config = require("./config.js");

async function parseXML(data) {
  try {
    const xml = await xml2js.parseStringPromise(data.toString());
    const body = xml["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0];
    const fault = body["SOAP-ENV:Fault"];
    if (fault) {
      return {
        faultCode: fault[0]["faultcode"][0],
        faultString: fault[0]["faultstring"][0],
      };
    }
    const response = body["ns1:executeCommandResponse"];
    if (response) {
      return {
        result: response[0]["result"][0],
      };
    }
    console.log(data.toString());
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw error;
  }
}

function Soap(command) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        port: config.soapPort,
        method: "POST",
        hostname: config.soapHostname,
        auth: config.soapAuth,
        headers: { "Content-Type": "application/xml" },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", async () => {
          try {
            const result = await parseXML(data);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(error);
    });

    req.write(
      `<?xml version="1.0" encoding="utf-8"?>
      <SOAP-ENV:Envelope
          xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:ns1="urn:TC">
      <SOAP-ENV:Body>
          <ns1:executeCommand>
              <command>${command}</command>
          </ns1:executeCommand>
      </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`
    );
    req.end();
  });
}

module.exports = { Soap };