function ai_setOpenAIAPIKey() {
  PropertiesService.getScriptProperties().setProperty('OPENAI_ASST_ID', 'asst_iM9xMhNSKiqVQMSL8iRCz8gB'); 
}

function ai_createThread() {
  const apiKey = PropertiesService.getUserProperties().getProperty('OPENAI_API_KEY');
  const url = 'https://api.openai.com/v1/threads';
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Thread created');
  return JSON.parse(response.getContentText());
}

function ai_addMessage(threadId, content, role = 'user') {
  const apiKey = PropertiesService.getUserProperties().getProperty('OPENAI_API_KEY');
  const url = `https://api.openai.com/v1/threads/${threadId}/messages`;
  
  const payload = {
    role: role,
    content: content
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Message added');
  return JSON.parse(response.getContentText());
}

function ai_runAssistant(threadId) {
  const apiKey = PropertiesService.getUserProperties().getProperty('OPENAI_API_KEY');
  const assistantId = PropertiesService.getScriptProperties().getProperty('OPENAI_ASST_ID');
  const url = `https://api.openai.com/v1/threads/${threadId}/runs`;
  
  const payload = {
    assistant_id: assistantId
  }; 
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Run started '+ response.getContentText());

  return JSON.parse(response.getContentText());
}

function ai_getRunStatus(threadId, runId) {
  const apiKey = PropertiesService.getUserProperties().getProperty('OPENAI_API_KEY');
  const url = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'OpenAI-Beta': 'assistants=v2'
    },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Run status '+ response.getContentText());

  return JSON.parse(response.getContentText());
}

function ai_getMessages(threadId, limit = 1) {
  const apiKey = PropertiesService.getUserProperties().getProperty('OPENAI_API_KEY');
  const url = `https://api.openai.com/v1/threads/${threadId}/messages?limit=${limit}`;
  
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'OpenAI-Beta': 'assistants=v2'
    },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('get message ' + response.getContentText());

  return JSON.parse(response.getContentText());
}
