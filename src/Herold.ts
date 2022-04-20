import { execInShell } from "./ShUtils"
import { writeFile } from "fs";

export function uploadMavenLog(mavenLogUrl: string, pathToPayload: string, pathToLogFile: string) {
    sendResults("text/plain", pathToLogFile, pathToPayload, mavenLogUrl)
}

export function uploadJunitResult(mavenLogUrl: string, pathToPayload: string, pathToJunitXml: string) {
    sendResults("application/xml", pathToJunitXml, pathToPayload, mavenLogUrl)
}

function sendResults(contentType: string, pathToResult: string, pathToEnvFile: string, url: string, proxyUrl: string = "http://surf.cc.azd.cloud.allianz:8080") {
    execInShell(`curl -x ${proxyUrl} -H "Content-Type:multipart/form-data" -F "file=@${pathToResult};type=${contentType}" -F "env=@${pathToEnvFile};type=application/json" ${url}`)
}

export function writePayload(company: string, fileName: string, testCase: any, branch: string = "develop") {
    let timestamp = new Date().toLocaleString('en_EU', { timeZone: 'Europe/Paris' });

    let payload = '{'
    payload += '"teststufe": "' + testCase.testStufe + '", ';
    payload += '"testart": "' + testCase.testUtil + '", ';
    payload += '"businessArea": "' + testCase.businessArea + '", ';
    payload += '"tribe": "' + testCase.tribe + '", ';
    payload += '"team": "' + testCase.team + '", ';
    payload += '"release": "' + testCase.release + '", ';
    payload += '"testEnvironment": "' + testCase.environment + '", ';
    payload += '"branch": "' + branch + '", ';
    payload += '"company": "' + company + '", ';
    payload += '"application": "' + testCase.application + '", ';
    payload += '"testObjectId": "' + testCase.testObjectId + '", ';
    payload += '"toscaWorkspace": "' + testCase.toscaWorkspace + '", ';
    payload += '"toscaUniqueId": "' + testCase.toscaUniqueId + '", ';
    payload += '"soapUiPath": "' + testCase.soapUiPath + '", ';
    payload += '"jUnitSuitePath": "' + testCase.junitSuite + '", ';
    payload += '"jiraID": "' + testCase.jiraID + '", ';
    payload += '"testObjectName": "' + testCase.testObjectName + '", ';
    payload += '"timestamp": "' + timestamp + '"';
    payload += '}'

    if (!fileName.endsWith(".json")) {
        fileName += ".json"
    }

    writeJson(fileName, payload)
}


export function writeTeamPayload(company: string, fileName: string, testCases: any[], branch: string = "develop") {
    let timestamp = new Date().toLocaleString('en_EU', { timeZone: 'Europe/Paris' });
    let testObjectIds: string[] = []
    let jiraIds: string[] = []
    let testObjectName: string[] = []
    let testCase: any = null
    testCases.forEach(testCaseElement => {
        if (testCase == null) {
            testCase = testCaseElement
        }
        if (testObjectIds.includes(testCaseElement.testObjectId) != null && !testObjectIds.includes(testCaseElement.testObjectId)) {
            testObjectIds.push(testCaseElement.testObjectId)
        }
        if (jiraIds.includes(testCaseElement.jiraID) != null && !jiraIds.includes(testCaseElement.jiraID)) {
            jiraIds.push(testCaseElement.jiraID)
        }
        if (testObjectName.includes(testCaseElement.testObjectName) != null && !testObjectName.includes(testCaseElement.testObjectName)) {
            testObjectName.push(testCaseElement.testObjectName)
        }
    })


    let payload = '{'
    payload += '"teststufe": "' + testCase.testStufe + '", ';
    payload += '"testart": "' + testCase.testUtil + '", ';
    payload += '"businessArea": "' + testCase.businessArea + '", ';
    payload += '"tribe": "' + testCase.tribe + '", ';
    payload += '"team": "' + testCase.team + '", ';
    payload += '"release": "' + testCase.release + '", ';
    payload += '"testEnvironment": "' + testCase.environment + '", ';
    payload += '"branch": "' + branch + '", ';
    payload += '"company": "' + company + '", ';
    payload += '"application": "' + testCase.application + '", ';
    payload += '"testObjectId": "' + testCase.testObjectId + '", ';
    payload += '"toscaWorkspace": "' + testCase.toscaWorkspace + '", ';
    payload += '"toscaUniqueId": "' + testCase.toscaUniqueId + '", ';
    payload += '"soapUiPath": "' + testCase.soapUiPath + '", ';
    payload += '"jUnitSuitePath": "' + testCase.junitSuite + '", ';
    payload += '"jiraID": "' + testCase.jiraID + '", ';
    payload += '"testObjectName": "' + testCase.testObjectName + '", ';
    payload += '"timestamp": "' + timestamp + '"';
    payload += '}'

    if (!fileName.endsWith(".json")) {
        fileName += ".json"
    }

    writeJson(fileName, payload)
}

function writeJson(fileName: string, json: string) {
    let prettyJson: string = JSON.stringify(JSON.parse(json), undefined, 4)
    writeFile(fileName, prettyJson, function (err) {
        if (err) {
            return console.error(err);
        }
    })
}

