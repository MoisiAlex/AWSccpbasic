window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";

    connect.core.initCCP(containerDiv, {
        ccpUrl: ccpUrl,        
        loginPopup: true,         
        softphone: {
            allowFramedSoftphone: true
        }
    });

    connect.contact(subscribeToContactEvents);   

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
        contact.onEnded(clearContactAttribute);
    }


    function addDashes(number){   
        f_val = number.replace(/\D[^\.]/g, "");
        phoneNumber = f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
        return phoneNumber;
    }

    function updateContactAttribute(contactID){
        const tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        let row = tableRef.insertRow(tableRef.rows.length);
        let cell1 = row.insertCell(0);
        let url = "https://jiradev.scouting.org/issues/?jql=%22Phone%20Number%22%20%20~%20%20"+addDashes(contactID);
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

