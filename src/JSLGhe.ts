import { get } from 'http'
import { context, getOctokit } from "@actions/github"

const decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

type GithubContext = typeof context

export function getAllOpenPullRequestWithOctokit(ghToken: string): any {
    const octokit = getOctokit(ghToken)
    octokit.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open"
    }).then(a => console.log(a))
}
// how this config looks?
// {
//     "ghe": {
//         "apiUrl": "something",
//     }
// }
function apiCallGet(config: Map<string, any>, apiEndpoint: string): any {
    if (!apiEndpoint.startsWith("/") && !apiEndpoint.startsWith("htt")) {
        apiEndpoint = config.get("ghe").apiUrl + "/" + apiEndpoint
    } else if (!apiEndpoint.startsWith("https://")) {
        apiEndpoint = config.get("ghe").apiUrl + apiEndpoint
    }

    // what about envs? should be passed in config or what?
    // withcredentials? usernamePassword?
    let gitUser = config.get("ghe").gitUser
    let gitPasswd = config.get("ghe").gitPasswd
    let auth = encode(`${gitUser}:${gitPasswd}`)
    // is it always like 1.1.1.1:1 ?
    let proxyUrl: string = config.get("server").proxuUrl

    //todo: think about better way to use request with proxy
    var options = {
        host: proxyUrl.split(":")[0],
        port: proxyUrl.split(":")[1],
        path: apiEndpoint,
        headers: {
            Authorization: `Basic ${auth}`
        }
    };
    let fbResponse: any
    get(options, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            fbResponse = JSON.parse(body);
            console.log("Got a response: ", fbResponse.picture);
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
    return fbResponse
}

function apiCallPost(config: Map<string, any>, apiEndpoint: string, rawBody: string): any {
    //todo after apiCallGet is done
}

function createPullRequests(config: Map<string, any>, owner: string, repo: string, title: string,
    head: string, base: string, body: string, maintainer: boolean, draft: boolean,) {
    let apiEndpoint: string = `/repos/${owner}/${repo}/pulls`
    let rawBody: string = JSON.stringify({
        title: `${title}`,
        body: `${body}`,
        head: `${head}`,
        base: `${base}`
    })
    return apiCallPost(config, apiEndpoint, rawBody)
}

function getAllOpenPullRequest(config: Map<string, any>): any {
    let apiEndpoint: string = `/repos/${config.get("abs").absGitGroup}/${config.get("abs").absRepoName}/pulls?state=open`
    return apiCallGet(config, apiEndpoint)
}


function cleanUpSynchPullRequests(openPullRequests: any, config: Map<string, any>) {
    //todo, what is openPullRequests? check github api, try it out with postman
}

function setLabel(config: Map<string, any>, owner: string, repo: string, labels: string[]): any {
    let apiEndpoint: string = `/repos/${owner}/${repo}/pulls`
    let rawBody: string = JSON.stringify({
        labels: `${labels}`,
    })
    return apiCallPost(config, apiEndpoint, rawBody)
}

// todo updateCommitStatus? not implemented????

