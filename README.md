

# CS52 Workshops:  AWS (Amazon Web Services) Workshop

![](https://static1.squarespace.com/static/599bfc6803596ef973b3fade/t/5adde270575d1f40f9b86b12/1524490877466/Amazon+Web+Serives)


Authors: Katherine Bernardez, Alexander Danilowicz, Stephen Liao, Lindsey Hodel, Robert Crawford

Brief motivation here as well as in presentation

## Overview

Summary of what we're about to do.

## Setup

Any necessary setup steps

## Step by Step

* Explanations of the what **and** the why behind each step. Try to include:
  * higher level concepts
  * best practices

Remember to explain any notation you are using.

```javascript
/* and use code blocks for any code! */
```

![screen shots are helpful](img/screenshot.png)

:sunglasses: GitHub markdown files [support emoji notation](http://www.emoji-cheat-sheet.com/)

Here's a resource for [github markdown](https://guides.github.com/features/mastering-markdown/).


## Summary / What you Learned

* [ ] can be checkboxes

## Resources

* cite any resources



## SAMPLE CODE INSTRUCTIONS
#When forking/cloning the repo, try to change the name of the directory. You need to do this because when claudia uploads to lambda function to aws, it uses the directory name as the function name and if everyone has the same direcotry name then there will be conflicting function names and no one will be able to deploy. Change the directory to `workshop-ws-5-8-aws-your_name`.

# Download aws-cli
`pip install awscli`

# Configure AWS-CLI with the proper credentials -- we will all be using Alex's aws account
After downloading aws-cli, run `aws configure` on the command line and enter the following fields as they come up.
```
AWSAccessKeyId = AKIAIWAIOL5CZ2JI3F4Q
AWSSecretKey = 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
Default Region name = us-west-1
```

# Download claudia.js
Claudia.js is a nice package that allows us to treat infrastructure as code. It lets us take any function we write and upload it as a lambda function. We could do this manually on AWS, by clicking around through a bunch of menus, but that wouldn't be very ~software engineer-y~ of us.

`npm install claudia -g`

# Set up claudia.js
https://claudiajs.com/tutorials/installing.html

Configure your `~/.aws/credentials` file to look like this:

```
[claudia]
ws_access_key_id = AKIAIMLKAQO7HZH6ZX2Q
aws_secret_access_key = gvZzxTxpoLF1PjR3+b1WZSij/TgJ2z5eLPCL3OJQ
aws_access_key_id = AKIAIWAIOL5CZ2JI3F4Q
```

And then, run set AWS_PROFILE environment variable to claudia with the following command:

```
export AWS_PROFILE=claudia
```
To make sure that we did that correctly, run `echo $AWS_PROFILE` and it should return the value `claudia`.

Great, now we're ready to start.

# Write the code
Here is where the groups will copy the code. Just follow the article and we should be fine.

Eventually, we need to make our `env.json` file and set our `SlackWebhookUrl`. To do this, we need to go to https://cs52-dartmouth.slack.com/apps/A0F7XDUAZ-incoming-webhooks?page=1 -> Add Configuration -> Choose Channel Dropdown -> Select Privately to yourself -> Add incoming webhooks integration -> Copy the webhook URL.


# Deploy to aws with Claudia

```
claudia create --region us-west-1 --handler index.handler --timeout 10 --set-env-from-json env.json
```

You should now see `claudia.json` in your directory. It should look like this:

```
{
  "lambda": {
    "role": "scheduled-slack-messages-executor",
    "name": "scheduled-slack-messages",
    "region": "us-west-1"
  }
}
```

`aws events put-rule --name hackerNewsDigest --schedule-expression 'cron(0/59 * * * ? *)'` Sets this as an event to trigger every hour (potential extra credit could be for someone to make this trigger once a day rather than every hour).

Running the above command will output the `arn` of the task. Copy it.

```
aws lambda add-permission \
  --statement-id 'hackernews-scheduled-messages' \
  --action 'lambda:InvokeFunction' \
  --principal 'events.amazonaws.com' \
  --source-arn ruleArn \
  --function-name functionName \
  --region region
```

`ruleArn` is the output from the `aws events...` command. `function-name` can be found by going to the aws console -> services -> lambda -> Functions.

Trigger the tasks officially with this command:

```
aws events put-targets --rule hackerNewsDigest --targets '[{ "Id": "1", "Arn": "your Lambda ARN" }]'
```
I don't know what the Id means. I feel like as it should be okay if everyone has their own lambda function with their own unique name on aws? Should test this to see if it works.

If the above command is executed, then you should receive an update of hackernews stories every hour. If you want to test it immediately, run `claudia test-lambda` and you should receive an update. You're all done!
