# What is this?
This script was written to save some time by updating targetprocess hours from terminal. And you can also integrate with some scheduler on your computer to remind your at scheduled times.

# How to use this?
- Make sure you have NodeJS installed
- Run `npm install` in the tp/ folder
- Get your targetprocess token:
1. Login to targetprocess in your browser.
2. Do a GET https://targetprocess.cisco.com/api/v1/Authentication
3. Update the token value in tp.js
- Get your userId:
1. Do a GET https://targetprocess.cisco.com/api/v1/Users?where=(Email eq 'YOUR_EMAIL')
2. Update userId value in tp.js
- After these step if you run `node kp.js` it should work. It will return a list of your tasks that are not in Completed state.
- Update hours from command line by typing: taskId|hour, taskId2|hour, ...

# Integrate with scheduler?
My personal approach on a Mac is:
- Open Utility/Script Editor
- Write a simple AppleScript. Example:

```
tell application "Terminal"
  do script 'node path/to/kp.js'
end Tell

```
- File -> Save as an application

Then in Apple's calendar app, at a repeating event at some time. Set alert action to "Open" the application you saved above. Example: http://osxdaily.com/2013/04/15/launch-file-app-scheduled-date-mac-os-x/

I'm sure there's many other ways to do it.