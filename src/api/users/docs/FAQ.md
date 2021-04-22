# FAQ

This document explains several frequently answered questions related to the Users Micro-Service and Firestore. See [`README.md`](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/users/README.md) for more information.

### How do we import/export data?

- The good news is that this is possible: the process is more involved that I can (or should) summarize, but it can be found [here](https://firebase.google.com/docs/firestore/manage-data/export-import). The bad news is that importing and exporting of data is directly tied to billing being turned on in the project's account settings.
  - **Caution**: _Exporting data from Cloud Firestore will incur one read operation per document exported. However, these reads will not appear in the usage section of the console. Make sure you understand this before setting up recurring exports to avoid an unexpected bill._

### How can I add a member to Firestore?

- Navigate to [https://console.firebase.google.com](https://console.firebase.google.com) and select Telescope. Select the gear icon in the upper left-hand corner and click on Users and permissions. From here you can click on the Add members button.
- Enter the new member’s email address and select the appropriate role (i.e. _permissions_) as required.
  - **Note**: _The member does NOT have to have a `@gmail.com` email. The new member will be sent an email with an acceptance link._

### How can I access Telescope's Firestore?

- Navigate to [https://console.firebase.google.com](https://console.firebase.google.com) and select Telescope.
- From the left-hand menu titled Build click on Firestore. The collections and documents created can be viewed on the Data tab.
  - **Note**: _Only approved Firestore members can navigate the Firestore project._
