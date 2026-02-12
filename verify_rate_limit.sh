#!/bin/bash
echo "Starting Rate Limit Verification..."
URL="http://localhost:8080/api/notifications/send"
CLIENT_ID="client_a"

for i in {1..10}
do
   echo -n "Request $i: "
   HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "X-Client-Id: $CLIENT_ID" -H "Content-Type: application/json" -d '{"to":"user@example.com"}' $URL)
   echo "Status $HTTP_CODE"
   if [ "$HTTP_CODE" == "429" ]; then
       echo "Rate limit hit as expected!"
   fi
done
