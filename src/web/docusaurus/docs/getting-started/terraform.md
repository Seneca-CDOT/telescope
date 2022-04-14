import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Setup resources with Terraform

:::caution

Please read [Use AWS EC2 As Your Development Environment](./vscode-ssh.md) before continue to this guide.

The Terraform config is setup to use a t2.large instance. [See cost estimate](./vscode-ssh.md)

:::

## Install Terraform

Please follow the [installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli#install-terraform) from Terraform.

## Create ssh key

```bash
ssh-keygen -t rsa -b 2048
```

- Key name: **telescope-key**
- Passphrase: (Empty)

### Access to your public key

```bash
cat telescope-key.pub
```

Store the returned value somewhere, we will used in our step below. (`SSH_PUBLIC_KEY` refer to our `telescope-key.pub` value)

## Download Terraform providers

1. Open a terminal
2. Run `cd config/terraform`
3. Run `terraform init`

## Create resources with Terraform

### Prerequisites

- You will need your `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`
- You will need your Public ssh key previous created in [Create ssh key](#create-ssh-key)
- Terraform providers initialized

Our configuration is setup to have 2 different way to assign our env value.

<Tabs className="unique-tabs">
  <TabItem value="CLI prompt">

### CLI prompt

1. Open a Terminal
2. Run `cd config/terraform`
3. Run `terraform apply`
4. Enter your `AWS_ACCESS_KEY_ID`,`AWS_SESSION_TOKEN`, `AWS_SECRET_ACCESS_KEY`, and `SSH_PUBLIC_KEY`
5. Enter `yes`

---

  </TabItem>
  <TabItem value="Env file">

### Env file

1. Open a Terminal
2. Run `cd config/terraform`
3. Open our `aws_credentials.tfvars` file.
4. Replace the value.
5. Run `terraform apply -var-file="aws_credentials.tfvars"`
6. Enter `yes`

---

  </TabItem>
</Tabs>

## Destroy your resources

Our configuration is setup to have 2 different way to assign our env value.

<Tabs className="unique-tabs">
  <TabItem value="CLI prompt">

### CLI prompt

1. Open a Terminal
2. Run `cd config/terraform`
3. Run `terraform destroy`
4. Enter your `AWS_ACCESS_KEY_ID`,`AWS_SESSION_TOKEN`, `AWS_SECRET_ACCESS_KEY`, and `SSH_PUBLIC_KEY`
5. Enter `yes`

---

  </TabItem>
  <TabItem value="Env file">

### Env file

1. Open a Terminal
2. Run `cd config/terraform`
3. Open our `aws_credentials.tfvars` file.
4. Replace the value.
5. Run `terraform destroy -var-file="aws_credentials.tfvars"`
6. Enter `yes`

---

  </TabItem>
</Tabs>

## Next steps

After our resources is setup, to connect to our environment, please continue to read [connect-using-ssh](./vscode-ssh.md#connect-using-ssh).
