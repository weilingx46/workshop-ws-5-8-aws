

# CS52 Workshops:  AWS (Amazon Web Services) Workshop

![](https://static1.squarespace.com/static/599bfc6803596ef973b3fade/t/5adde270575d1f40f9b86b12/1524490877466/Amazon+Web+Serives)


Authors: Katherine Bernardez, Alexander Danilowicz, Stephen Liao, Lindsey Hodel, Robert Crawford

Brief motivation here as well as in presentation

## Overview

Summary of what we're about to do.

## Setup
- Fork this repo. Make sure to change the name of the directory to `workshop-ws-5-8-aws-YOUR-NAME`.
To do this go to settings and change Repository name. You need to do this because when claudia uploads to lambda function to aws, it uses the directory name as the function name and if everyone has the same directory name then there will be conflicting function names and no one will be able to deploy.

### Sign up for a free AWS account
- click [here](https://aws.amazon.com/) and then on Create A Free Account. Enter your information.
We chose personal account, but it shouldn't matter. You'll have to enter your credit card information, because after the first 12 months AWS starts to bill you (don't worry we will cancel
our account at the end of class).

## Step by Step

# Download aws-cli
`pip install awscli`

# Configure AWS-CLI with your proper credentials
- In the top right click on your account name and then on My Security Credentials. Expand Access
keys tab and click on Create New Access Key. Hold on to the **access key** and **secret key**.
Run
`aws configure`
On the command line, enter your access key and secret key as they come up.
```
AWS Access Key Id = INSERT-YOUR-ACCESS-KEY
AWS Secret Key = INSERT-YOUR-SECRET-KEY
Default Region name = us-east-2
```
Note that we are working in *us-east-2* as our region!!

# Download claudia.js
Claudia.js is a nice package that allows us to treat infrastructure as code. It lets us take any function we write and upload it as a lambda function. We could do this manually on AWS, by clicking around through a bunch of menus, but that wouldn't be very ~software engineer-y~ of us.

`npm install claudia -g`

# Set up claudia.js
https://claudiajs.com/tutorials/installing.html

Configure your `~/.aws/credentials` file to look like this:

```
[claudia]
aws_secret_access_id = INSERT-YOUR-ACCESS-KEY
aws_access_key_id = INSERT-YOUR-SECRET-KEY
```

And then, run set AWS_PROFILE environment variable to claudia with the following command in your top-level project dir:

```
export AWS_PROFILE=claudia
```
To make sure that we did that correctly, run `echo $AWS_PROFILE` and it should return the value `claudia`.

Great, now we're ready to start.

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


![](img\change-repo-name.PNG)





# Write the code
Here is where the groups will copy the code. Just follow the article and we should be fine.

Eventually, we need to make our `env.json` file and set our `SlackWebhookUrl`. To do this, we need to go to https://cs52-dartmouth.slack.com/apps/A0F7XDUAZ-incoming-webhooks?page=1 -> Add Configuration -> Choose Channel Dropdown -> Select Privately to yourself -> Add incoming webhooks integration -> Copy the webhook URL.


# Deploy to aws with Claudia

```
claudia create --region us-east-2 --handler index.handler --timeout 10 --set-env-from-json env.json
```

You should now see `claudia.json` in your directory. It should look like this:

```
{
  "lambda": {
    "role": "scheduled-slack-messages-executor",
    "name": "scheduled-slack-messages",
    "region": "us-east-2"
  }
}
```

The "role" and "name" don't have to match the above ^^ but they should be there.
Run this code

`aws events put-rule --name hackerNewsDigest --schedule-expression 'cron(0/59 * * * ? *)'` Sets this as an event to trigger every hour (potential extra credit could be for someone to make this trigger once a day rather than every hour).

Running the above command will output the `arn` of the task. The output will look something like:

```
{
   “Statement”: “{\“Sid\“:\“hackernews-scheduled-messages\“,\“Effect\“:\“Allow\“,\“Principal\“:{\“Service\“:\“events.amazonaws.com\“},\“Action\“:\“lambda:InvokeFunction\“,\“Resource\“:\“arn:aws:lambda:us-east-2:916258591510:function:workshop-ws-5-8-aws\“,\“Condition\“:{\“ArnLike\“:{\“AWS:SourceArn\“:\“arn:aws:events:us-east-2:916258591510:rule/hackerNewsDigest\“}}}”
}
```
We want to *copy* this: `arn:aws:lambda:us-east-2:916258591510:function:workshop-ws-5-8-aws\`

Now, run this function with the string you just copied into INSERT-YOUR-ARN:
```
aws lambda add-permission \
  --statement-id 'hackernews-scheduled-messages' \
  --action 'lambda:InvokeFunction' \
  --principal 'events.amazonaws.com' \
  --source-arn INSERT-YOUR-ARN \
  --function-name functionName \
  --region region
```

`ruleArn` is the output from the `aws events...` command. `function-name` can be found by going to the aws console -> services -> lambda -> Functions.

todo: ^^ make more detailed instructions for finding function-name

Run `claudia test-lambda` and you should receive an update. You're all done!

If you want to see a slack message come up now, run `claudia test-lambda`.
