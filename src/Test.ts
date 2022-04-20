import { existsSync, fstat, readFileSync, writeFile, writeFileSync } from 'fs'

// YAML example needed

// selectSpecificValuesFromYAMLToStack same here,

// selectSpecificValuesFromYAMLToList weird

// createEvenLists ? needed? only 1 workrer per step
// createEvenListsWithNodeNames ?? no nodes in github actions

// readConfigurationYaml
// readFullConfiurationYaml
// findJunitTestResults ? what does it to?

export function convertTestTypeId(testTypeId: number): string | undefined {
    switch (testTypeId) {
        case 1: return "tosca"
        case 2: return "soapui"
        default: return undefined
    }
}

export function writeContentToFile(content: string, pathToFile: string) {
    writeFile(pathToFile, content, function (err) {
        if (err) {
            return console.error(err);
        }
    })
}

export function checkIfFileExists(filePath: string): boolean {
    return existsSync(filePath)
}

export function readValueFromIni(fileName: string, key: string): string {
    let data: string = readFileSync(fileName).toString()
    let lines: string[] = data.split("\n")
    let value = ""
    lines.forEach(line => {
        let keyWithValue = line.split("=")
        let propKey = keyWithValue[0]
        if (propKey == key) {
            value = keyWithValue[1]
        }
    })
    console.log(data)
    console.log(`read value ${value} from file ${fileName}`)
    return value
}