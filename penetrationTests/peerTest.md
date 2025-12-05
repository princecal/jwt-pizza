## Peer Pen Test Partners - Corwyn Giles and Damon Stevens


### Corwyn Giles Self attack record

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 4th, 2025                                                                  |
| Target         | pizza.princecal.click                                                       |
| Classification | Identification and Authentication Failures                                                                      |
| Severity       | 4                                                                              |
| Description    | Admin Account Stolen.  All user data destroyed. List of user emails probably stolen.  Admin User Destroyed.             |
| Images         | ![No users](noUsers.png) <br/> All Users have been destroyed. |
| Corrections    | Adjust Admin user so that the password is no longer admin.                                                       |



### Corwyn Giles Peer attack record

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 5th, 2025                                                                  |
| Target         | pizza.cs329blaze.click                                                       |
| Classification | Injection                                                                     |
| Severity       | 0                                                                              |
| Description    | SQL Database Injection failed due to databaser rejecting multiple commands.            |
| Images         | ![failed access](noUsers.png) <br/> Admin access not granted |
| Corrections    | Adjust update users endpoint to no longer allow sql injection                                                      |