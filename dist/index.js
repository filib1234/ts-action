"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const Maven_1 = require("./Maven");
const inputName = (0, core_1.getInput)("name");
const ghToken = (0, core_1.getInput)("ghToken");
greet(inputName);
async function greet(name) {
    console.log(`'Hello ${name}!'`);
    let test = "asd";
    console.log(`variable: "${test}"`);
    (0, Maven_1.multilineTest)();
}
