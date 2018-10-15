 window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";


    //add any contact Attributes that should be hidden
    const CONFIG = 
          {
            "hiddenCA": ["sample"]
          };

    //replace with API URL
    const metricAPI = "https://uhht7vyu3j.execute-api.us-east-1.amazonaws.com/Production";


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
        
        updateContactAttribute(contact.getAttributes());    
        updateQueueAttribute();
        contact.onEnded(clearContactAttribute);
        contact.onEnded(clearQueueAttribute);
        contact.onAccepted(clearQueueAttribute);
    }

    function updateContactAttribute(msg){
        const tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];      
        for (let key in msg) {
           if (msg.hasOwnProperty(key) && CONFIG.hiddenCA.indexOf(key)==-1) {
                        const row = tableRef.insertRow(tableRef.rows.length);
                        let cell1 = row.insertCell(0);
                        let cell2 = row.insertCell(1);
                        cell1.innerHTML = key;
                        cell2.innerHTML = msg[key]['value'];
            }
        }
        
    }

        function millisToMinAndSec(millis) {
          var minutes = Math.floor(millis / 60000);
          var seconds = ((millis % 60000) / 1000).toFixed(0);
          return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }

        function setCookie(cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return 0;
        }


    function getCurrentMetrics(){
        var request = new XMLHttpRequest();

        request.open('GET', metricAPI , true);
        request.onload = function () {

          // Begin accessing JSON data here
          var data = JSON.parse(this.response);

          if (request.status >= 200 && request.status < 400) {
             console.log(data);
             return(data);            
          } else {
            console.log('error');
            return(null);  
          }
        }

    request.send();

        
    }

    function updateQueueAttribute(){

        var requestData = getCurrentMetrics();
        
        if(requestData.CONTACTS_IN_QUEUE > 0){
            setCookie(contactsInQueue,requestData.CONTACTS_IN_QUEUE,1);
            setCookie(oldestContactAge,requestData.OLDEST_CONTACT_AGE,1);
            
              document.getElementById('calls').innerHTML = requestData.CONTACTS_IN_QUEUE;
              document.getElementById('lwt').innerHTML = millisToMinAndSec(requestData.OLDEST_CONTACT_AGE);

            
        }
        else if(getCookie(contactsInQueue)>0)
            {
                
              document.getElementById('calls').innerHTML = getCookie(contactsInQueue);
              document.getElementById('lwt').innerHTML = millisToMinAndSec(getCookie(oldestContactAge));
                            
            }
        else{
             document.getElementById('calls').innerHTML = "1";
             document.getElementById('lwt').innerHTML = millisToMinAndSec(requestData.OLDEST_CONTACT_AGE);
        }

        
              document.getElementById('availableAgents').innerHTML = requestData.AGENTS_AVAILABLE;
              document.getElementById('onlineAgents').innerHTML = requestData.AGENTS_ONLINE;
        

    }


    function clearContactAttribute(){
        const old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        const new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }

    function clearQueueAttribute(){
          document.getElementById('calls').innerHTML = " ";
          document.getElementById('lwt').innerHTML = " ";
          document.getElementById('availableAgents').innerHTML = " ";
          document.getElementById('onlineAgents').innerHTML = " ";
    }


    function logMsgToScreen(msg) {
        logMsgs.innerHTML =  new Date().toLocaleTimeString() + ' : ' + msg + '<br>' + logMsgs.innerHTML;
    }


    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }


// LogMessages section display controls

var showLogsBtn = document.getElementById('showAttributes');
var showLogsDiv = document.getElementById('hiddenAttributes');
var hideLogsBtn = document.getElementById('hideAttributes');
var hideLogsDiv = document.getElementById('visibleAttributes');


showLogsBtn.addEventListener('click',replaceDisplay);

hideLogsBtn.addEventListener('click',replaceDisplay);

    function replaceDisplay(){
            showLogsDiv.style.display = showLogsDiv.style.display === 'none' ? '' : 'none';
            hideLogsDiv.style.display = hideLogsDiv.style.display === 'none' ? '' : 'none';
    }

