
window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";

    //add any contact attributes to be excluded

    const CONFIG = 
          {
            "hiddenCA": ["secret"]
          };


    connect.core.initCCP(containerDiv, {
        ccpUrl: ccpUrl,        
        loginPopup: true,         
        softphone: {
            allowFramedSoftphone: true
        }
    });

    connect.contact(subscribeToContactEvents);   
    connect.agent(subscribeToAgentEvents);

    function subscribeToContactEvents(contact) {
        window.myCPP.contact = contact;

        logInfoMsg("New contact offered. Subscribing to events for contact");
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) {
            logInfoMsg("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
        } else {
            logInfoMsg("This is an existing contact for this agent");
        }
        logInfoMsg("Contact is from queue " + contact.getQueue().name);    
        logInfoMsg("ContactID is " + contact.getContactId());   
        logInfoMsg("Contact attributes are " + JSON.stringify(contact.getAttributes()));

         
        updateContactAttribute(contact.getActiveInitialConnection().getEndpoint().phoneNumber);   

        contact.onConnected(updateUi);
        contact.onEnded(clearContactAttribute);
    }

    function subscribeToAgentEvents(agent){
         console.log("Subscribing to agent events...");
         var name = agent.getName();
         console.log("Agent Name Is " + name);
         var config = agent.getConfiguration();
         console.log("Agent configuration is " + agent.username + " " + agent.name);
    }


    function updateContactAttribute(contactID){
        const tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        
                        let row = tableRef.insertRow(tableRef.rows.length);
                        let cell1 = row.insertCell(0);
                        let url = "https://jiradev.scouting.org/issues/?jql=%22Phone%20Number%22%20%20~%20%"+contactID.replace('+1', '%20');
                        cell1.innerHTML = '<a href="'+url+'"target="_blank">JIRA link</a>';
                       
                }
            
        


        
    function clearContactAttribute(){
        let old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        let new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }


    function logMsgToScreen(msg) {
        logMsgs.innerHTML =  new Date().toLocaleTimeString() + ' : ' + msg + '<br>' + logMsgs.innerHTML;
    }

    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }


// LogMessages section display controls

const showLogsBtn = document.getElementById('showAttributes');
const showLogsDiv = document.getElementById('hiddenAttributes');
const hideLogsBtn = document.getElementById('hideAttributes');
const hideLogsDiv = document.getElementById('visibleAttributes');

showLogsBtn.addEventListener('click',replaceDisplay);
hideLogsBtn.addEventListener('click',replaceDisplay);

    function replaceDisplay(){
            showLogsDiv.style.display = showLogsDiv.style.display === 'none' ? '' : 'none';
            hideLogsDiv.style.display = hideLogsDiv.style.display === 'none' ? '' : 'none';
    }

