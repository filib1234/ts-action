"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const SoapUI_1 = require("./SoapUI");
const inputName = (0, core_1.getInput)("name");
const ghToken = (0, core_1.getInput)("ghToken");
greet(inputName);
async function greet(name) {
    console.log(`'Hello ${name}!'`);
    let test = "asd";
    console.log(`variable: "${test}"`);
    let releaseTests = [
        { environment: "env1", pathToProjectDirectory: "ptpd1", soapUiProjectName: "supn1", soapUiPath: "sup1", businessArea: "ba1", tribe: "tribe1", team: "team1" },
        { environment: "env2", pathToProjectDirectory: "ptpd2", soapUiProjectName: "supn2", soapUiPath: "sup2", businessArea: "ba2", tribe: "tribe2", team: "team2" },
        { environment: "env3", pathToProjectDirectory: "ptpd3", soapUiProjectName: "supn3", soapUiPath: "sup3", businessArea: "ba3", tribe: "tribe3", team: "team3" },
    ];
    console.log((0, SoapUI_1.generatePomString)(releaseTests, "filip-workspace"));
    let testCase = {
        environment: "env1",
        pathToProjectDirectory: "ptpd1",
        soapUiProjectName: "supn1",
        soapUiPath: "sup1",
        soapUiKeystore: "suk1",
        businessArea: "ba1",
        tribe: "tribe1",
        team: "team1"
    };
    (0, SoapUI_1.writeSettings)(testCase, "filip-workspace");
}
