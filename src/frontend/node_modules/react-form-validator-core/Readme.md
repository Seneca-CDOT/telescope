## Validation component for react forms

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/react-form-validator-core.svg)](https://badge.fury.io/js/react-form-validator-core)
[![Build Status](https://travis-ci.org/NewOldMax/react-form-validator-core.svg?branch=master)](https://travis-ci.org/NewOldMax/react-form-validator-core)

Simple form validation component for react forms inspired by [formsy-react](https://github.com/christianalfoni/formsy-react)

Default validation rules:
+ matchRegexp
+ isEmail
+ isEmpty
+ required
+ trim
+ isNumber
+ isFloat
+ isPositive
+ minNumber
+ maxNumber
+ minFloat
+ maxFloat
+ isString
+ minStringLength
+ maxStringLength
+ maxFileSize
+ allowedExtensions

Some rules can accept extra parameter, example:
````javascript
<YourValidationInput
   {...someProps}
   validators={['minNumber:0', 'maxNumber:255', 'matchRegexp:^[0-9]$']}
/>
````

### Usage

````javascript
import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class TextValidator extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <div>
                <input
                    {...rest}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </div>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={{ color: 'red' }}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default TextValidator;
````

````javascript
...
import { ValidatorForm } from 'react-form-validator-core';
...
render() {
    return (
        <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
        >
            <TextValidator
                onChange={this.handleChange}
                name="email"
                value={email}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
            />
            <button type="submit">submit</button>
        </ValidatorForm>
    );
}
...
````

````javascript

class FileValidator extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <div>
        <input type="file" {...rest}>
        {this.errorText()}
      </div>
    );
  }

  errorText() {
    const { isValid } = this.state;

    if (isValid) {
      return null;
    }

    return <div style={{ color: "red" }}>{this.getErrorMessage()}</div>;
  }
}
export default FileValidator;

...
import { ValidatorForm } from 'react-form-validator-core';
...
render() {
    return (
        <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
        >
            <FileValidator
                onChange={this.handleChange}
                name="file"
                type="file"
                value={file}
                validators={['isFile', 'maxFileSize:' + 1 * 1024 * 1024, 'allowedExtensions:image/png,image/jpeg']}
                errorMessages={['File is not valid', 'Size must not exceed 1MB', 'Only png and jpeg']}
            />
            <button type="submit">submit</button>
        </ValidatorForm>
    );
}
...
````

#### You can add your own rules
````javascript
ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    if (value !== this.state.user.password) {
        return false;
    }
    return true;
});
````
Get them
````javascript
ValidatorForm.getValidationRule('isPasswordMatch');
````
Remove them
````javascript
ValidatorForm.removeValidationRule('isPasswordMatch');
````
And check is validation rule already in list
````javascript
ValidatorForm.hasValidationRule('isPasswordMatch');
````

### Migration guide

#### From 0.x to 1.x

Breaking changes was introduced in order to avoid legacy context. You should change `render` method of your input components to `renderValidatorComponent`.

Before:
````javascript
import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class TextValidator extends ValidatorComponent {
    render() {
        // return your validated component
    }
}

export default TextValidator;
````

After:
````javascript
import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class TextValidator extends ValidatorComponent {
    renderValidatorComponent() {
        // return your validated component
    }
}

export default TextValidator;
````

### API

#### ValidatorForm

+ Props

| Prop            | Required | Type     | Default value | Description                                                                                                                  |
|-----------------|----------|----------|---------------|------------------------------------------------------------------------------------------------------------------------------|
| onSubmit        | true     | function |               | Callback for form that fires when all validations are passed                                                                 |
| instantValidate | false    | bool     | true          | If true, form will be validated after each field change. If false, form will be validated only after clicking submit button. |
| onError         | false    | function |               | Callback for form that fires when some of validations are not passed. It will return array of elements which not valid. |
| debounceTime    | false    | number   | 0             | Debounce time for validation i.e. your validation will run after `debounceTime` ms when you stop changing your input |

+ Instance methods (via ref)

| Name             | Params | Return | Description                                        |
|------------------|--------|--------|----------------------------------------------------|
| resetValidations |        |        | Reset validation messages for all validated inputs |
| isFormValid      | dryRun: bool (default true) | Promise   | Get form validation state in a Promise (`true` if whole form is valid). Run with `dryRun = false` to show validation errors on form |

+ Static methods (via class)

| Name             | Params | Return | Description                                        |
|------------------|--------|--------|----------------------------------------------------|
| addValidationRule | name: string, callback: function |        | Add new validation rule |
| getValidationRule | name: string | function | Get validation rule by name |
| hasValidationRule | name: string | bool     | Check if rule exsits  |
| removeValidationRule | name: string |       | Remove validation rule  |

#### All validated fields (ValidatorComponent)

+ Props

| Prop            | Required | Type     | Default value | Description                                                                            |
|-----------------|----------|----------|---------------|----------------------------------------------------------------------------------------|
| validators      | false    | array    |               | Array of validators. See list of default validators above.                             |
| errorMessages   | false    | array    |               | Array of error messages. Order of messages should be the same as `validators` prop.    |
| name            | true     | string   |               | Name of input                                                                          |
| validatorListener | false  | function |               | It triggers after each validation. It will return `true` or `false`                    |
| withRequiredValidator | false | bool  |               | Allow to use `required` validator in any validation trigger, not only form submit      |
| containerProps | false | object  |               | Allow to customize input wrapper `div`      |

+ Methods

| Name             | Params | Return | Description                                        |
|------------------|--------|--------|----------------------------------------------------|
| getErrorMessage  |        |        | Get error validation message                       |
| validate         | value: any, includeRequired: bool | | Run validation for current component |
| isValid          |        | bool   | Return current validation state                    |
| makeInvalid      |        |        | Set invalid validation state                       |
| makeValid        |        |        | Set valid validation state                         |

### Implementations

 + [material-ui](https://www.npmjs.com/package/react-material-ui-form-validator)

### Contributing

This component covers all my needs, but feel free to contribute.
