function loadAddOn(event) {
  var accessToken = event.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  if(!checkAPIkeySetup())
  {
    return createSetupCard();
  }

  var messageId = event.gmail.messageId;
  var mailMessage = GmailApp.getMessageById(messageId);

  var from = mailMessage.getFrom();

  var ReadForMeButton = CardService.newTextButton()
    .setText("Read for me")
    .setOnClickAction(CardService.newAction()
      .setFunctionName('handleCreateThreadClick')
      .setParameters({
        messageId: messageId,
        accessToken: accessToken
      }));

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Read for me"))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText("Do you want me to read the email from <br>" + from))
      .addWidget(ReadForMeButton))
    .build();

  return [card];
}

function handleCreateThreadClick(e) {
  // get properties from e
  var messageId = e.parameters.messageId;
  var accessToken = e.parameters.accessToken;
  try {
    //get the message from gmail
    GmailApp.setCurrentMessageAccessToken(accessToken);
    var mailMessage = GmailApp.getMessageById(messageId);
    var body = mailMessage.getPlainBody();
    // create openAI thread
    var threadResponse = ai_createThread();
    var threadId = threadResponse.id;
    // add the email body to the openAI thread
    ai_addMessage(threadId, body);
    // run assistant on the thread
    var runResponse = ai_runAssistant(threadId);
    var runId = runResponse.id;
    // check if run is completed
    var status = ai_getRunStatus(threadId, runId);
    var attempts = 0;
    // check every 0.5 seconds, 60 times
    while (status.status !== 'completed' && attempts < 60) {
      // if failed, abort
      if(status.status == 'failed') attempts = 60;
      Utilities.sleep(500);
      status = ai_getRunStatus(threadId, runId);
      attempts++;
    }
    // if time is up, throw error
    if (status.status !== 'completed') {
      throw new Error("Assistant did not complete in time error: "+ status.status);
    }
    // ger the results
    var result = ai_getMessages(threadId);
    //modify the results to html
    result = (JSON.parse(JSON.stringify(result, null, 2))).data[0].content[0].text.value;
    result = formatJsonToHtml(result);
    // print results to gmail card
    var resultCard = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Results"))
      .addSection(CardService.newCardSection()
        //.addWidget(CardService.newTextParagraph().setText("Thread ID: " + threadId))
        //.addWidget(CardService.newTextParagraph().setText("Status: Completed"))
        .addWidget(CardService.newTextParagraph().setText(result)))
      .build();

    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(resultCard))
      .build();

  } catch (error) {
    console.error("Error in handleCreateThreadClick: " + error.message);
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(createErrorCard(error.message)))
      .build();
  }
}

function formatJsonToHtml(jsonString) {
  const data = JSON.parse(jsonString);
  
  let html = 'Action Items<br><br>';
  data.action_items.forEach(item => {
    html += `•${item.item}<br>`;
  });
  html += '<br><br>';
  
  html += 'Summary Points<br><br>';
  data.summary_points.forEach(item => {
    html += `•${item.item}<br>`;
  });
  
  return html;
}


function createErrorCard(errorMessage) {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Error"))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText("An error occurred: " + errorMessage)))
    .build();
}

function checkAPIkeySetup() {
  // global property name
  var propertyName = 'OPENAI_API_KEY';
  var userProperties = PropertiesService.getUserProperties();

  //debug line for testing key collection on first run
  //userProperties.deleteProperty(propertyName);
  //debug line

  var propertyValue = userProperties.getProperty(propertyName);
  if (propertyValue === null) {
    // Property doesn't exist,
    return false;
  } else {
    // Property already exists
    return true;
  }
}

// setup openAI api key as global property
function createSetupCard() {
  var card = CardService.newCardBuilder();
  
  var textInput = CardService.newTextInput()
    .setFieldName('serviceKey')
    .setTitle('Enter your OpenAI API key')
    .setHint('This key is required for the add-on to use OpenAI to read your emails');
  
  var action = CardService.newAction()
    .setFunctionName('saveServiceKey')
    .setParameters({key: 'serviceKey'});
  
  var button = CardService.newTextButton()
    .setText('Save')
    .setOnClickAction(action);
  
  card.addSection(CardService.newCardSection()
    .addWidget(textInput)
    .addWidget(button));
  
  return card.build();
}

function saveServiceKey(e) {
  var serviceKey = e.formInput.serviceKey;
  PropertiesService.getUserProperties().setProperty('OPENAI_API_KEY', serviceKey);
  return createInfoCard('OpenAI API key has been set up successfully! <br> please refresh the page.');
}

function createInfoCard(message) {
  var card = CardService.newCardBuilder();
  
  var textWidget = CardService.newTextParagraph()
    .setText(message);

  card.addSection(
    CardService.newCardSection()
      .addWidget(textWidget)
  );
  
  return card.build();
}






