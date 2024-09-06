# OpenAI Assistant API Integration for Google Apps Script

This project provides a set of functions to interact with OpenAI's Assistant API using Google Apps Script. It allows you to create threads, add messages, run an assistant, check run status, and retrieve messages.

## Features

- Set OpenAI API key and Assistant ID
- Create new conversation threads
- Add messages to existing threads
- Run an assistant on a thread
- Check the status of an assistant run
- Retrieve messages from a thread

## Functions

### ai_setOpenAIAPIKey()

Sets the OpenAI Assistant ID in the script properties.

### ai_createThread()

Creates a new thread for conversation with the OpenAI Assistant.

### ai_addMessage(threadId, content, role)

Adds a message to an existing thread.

**Parameters:**
- `threadId`: The ID of the thread to add the message to
- `content`: The content of the message
- `role`: The role of the message sender (default: 'user')

### ai_runAssistant(threadId)

Runs the assistant on a specified thread.

**Parameters:**
- `threadId`: The ID of the thread to run the assistant on

### ai_getRunStatus(threadId, runId)

Checks the status of an assistant run.

**Parameters:**
- `threadId`: The ID of the thread
- `runId`: The ID of the run to check

### ai_getMessages(threadId, limit)

Retrieves messages from a thread.

**Parameters:**
- `threadId`: The ID of the thread to get messages from
- `limit`: The maximum number of messages to retrieve (default: 1)

## Usage

1. Set up your OpenAI API key in the Google Apps Script project's user properties.
2. Call `ai_setOpenAIAPIKey()` to set the Assistant ID.
3. Use the provided functions to interact with the OpenAI Assistant API.

## Requirements

- Google Apps Script environment
- OpenAI API key with access to the Assistant API
- OpenAI Assistant ID

## Note

This code uses the OpenAI API beta version for assistants (v2). Make sure you have the appropriate permissions and API access before using these functions.
