 window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
   // const ccpUrl = "https://MYINSTANCE.awsapps.com/connect/ccp#/";
    const ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";

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
        updateContactAttribute(contact.getAttributes());    
        contact.onEnded(clearContactAttribute);
        updateQueueAttribute();
    }

    function updateContactAttribute(msg){
        const tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];      
        for (let key in msg) {
            if (msg.hasOwnProperty(key)) {
                        let row = tableRef.insertRow(tableRef.rows.length);
                        let cell1 = row.insertCell(0);
                        let cell2 = row.insertCell(1);
                        cell1.innerHTML = key;
                        cell2.innerHTML = msg[key]['value'];
            }
        }
        
    }

    function clearContactAttribute(){
        const old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        const new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }

    function millisToMinAndSec(millis) {
          const minutes = Math.floor(millis / 60000);
          const seconds = ((millis % 60000) / 1000).toFixed(0);
          return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }

     function getCurrentMetrics(){
            const request = new XMLHttpRequest();
            request.open('GET', metricAPI , true);
            request.onload = function () {

              // Begin accessing JSON data here
              let data = JSON.parse(this.response);

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


    async function  updateQueueAttribute (){
        let data = await getCurrentMetrics();
        document.getElementById('calls').innerHTML = data.CONTACTS_IN_QUEUE;
        document.getElementById('lwt').innerHTML = millisToMinAndSec(data.OLDEST_CONTACT_AGE);
        document.getElementById('availableAgents').innerHTML = data.AGENTS_AVAILABLE;
        document.getElementById('onlineAgents').innerHTML = data.AGENTS_ONLINE;

    }