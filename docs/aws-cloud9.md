## AWS Cloud9 IDE Setup

**Disclaimer**: Amazon Web Services offers a [Free-Tier](https://aws.amazon.com/free/) and this doc will help you set up a Cloud9 environment using the free-tier services but please be aware that you may incur costs if you go out of the free-tier offerings.

### Prerequisites:

- Create an [AWS Account](https://aws.amazon.com/). You can watch this [part](https://www.youtube.com/watch?v=3hLmDS179YE&t=10552s) of the AWS Certified Cloud Practitioner course on creating an account if you need help.
- Sign into your AWS Account

### Creating your Cloud9 Environment

1. In the upper-right hand corner of your AWS Management Console, select `US East (N. Virginia) us-east-1` as your `Region`
2. In the upper-left hand corner of your AWS Management Console, click on `Services`. This is bring up a list of AWS Services, search for `Cloud9`.
3. Click on `Create Environment`

- Step 1 - Name environment:

  Name: `Telescope-Dev` (whatever you want)

  Description (optional):

- Step 2 - Configure settings:

  Environment type: `Create a new EC2 instance for environment (direct access)`

  Instance type: `t2.micro (1 GiB RAM + 1 vCPU)`

  Platform: `Ubuntu Server 18.04 LTS`

- Step 3 - Review and click `Create Environment`
