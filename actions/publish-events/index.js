/*
* <license header>
*/

/**
 * This is a sample action showcasing how to create a cloud event and publish to I/O Events
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */
import { Octokit } from "@octokit/core";

const { Core, Events } = require('@adobe/aio-sdk')

const {
  CloudEvent
} = require("cloudevents");
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    const octokit = new Octokit({
      auth: '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'
    })

    await octokit.request('POST /repos/jacintocapote/test-actions/dispatches', {
      owner: 'jacintocapote',
      repo: 'test-actions',
      event_type: 'rebuild',
      client_payload: {
        unit: false,
        integration: true
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const statusCode = 204;
    logger.info('Launched rebuild next.js')
    const response = {
      statusCode: statusCode,
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

