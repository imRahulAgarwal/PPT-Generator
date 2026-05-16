### API Execution Results Explanation

- As the API requests were using Promise.all, the requests were sent at once and resulted in no-cache output to be returned;
- In the second run as the results were already present, the cached output was returned;
- I have attached the API executions image and the script is used accordingly.
