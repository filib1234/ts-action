// curl -X POST \
//   http://<yourJiraurl>/rest/api/2/project \
//   -H 'Authorization: Basic cm9ubmllOlRhdGVyYnVnMTIj' \
//   -H 'Content-Type: application/json' \
//   -H 'cache-control: no-cache' \
//   -d '{
//  "key": "SOF",
//  "name": "Software Sample",
//  "projectTypeKey": "software",
//  "projectTemplateKey": "com.pyxis.greenhopper.jira:gh-scrum-template",
//  "description": "Example Project description",
//  "lead": "ronnie",
//  "assigneeType": "PROJECT_LEAD",
//  "avatarId": 10200
//  }'

import { request } from "http"

export function createNewProject(url: string, credentailsId: string, projectName: string, projectKey: string, email: string) {
    let body = `
        {
            "key": "${projectKey}",
            "name": "${projectName}",
            "projectTypeKey": "business",
            "projectTemplateKey": "com.atlassian.jira-core-project-templates:jira-core-project-management",
            "description": "This is project ${projectName} on JMP dev04",
            "lead": "${email}",
            "url": "http://atlassian.com",
            "assigneeType": "PROJECT_LEAD",
            "avatarId": 10200
        }`

    var post_options = {
        path: '/rest/api/2/project',
        method: 'POST',
        headers: { // what about auth? jenkins is using auth param, from key=value gloabl storage?
            'Content-Type': 'application/json',
        }
    };

    request(url, post_options)
}