# Boarding Core

I want to build a web-based Islamic boarding school (Pesantren) management system named BoardingCore that is designed for one institution but capable of managing multiple branches. Each branch can manage its own operational data such as students, rooms, classes, finances, and transactions. The system should support multiple user roles including Super Admin, Branch Admin, Treasurer, Academic Staff, Dormitory Supervisor, and Student Guardians (Parents), each with different access permissions.

The system must provide a student management module where administrators can manage student data including student ID (NIS), name, gender, birth date, admission year, and status. Each student is connected to a guardian account so parents can log in and monitor their child’s information. Students can also be assigned to classes and dormitory rooms, allowing the institution to manage both academic and residential data in an organized way across different branches.

The platform should also include an academic module where staff can manage subjects, student grades, and attendance records. Grades are recorded per subject and semester, while attendance tracks daily presence such as present, sick, permitted leave, or absent. In addition, the system should support student discipline records, where staff can log violations, assign penalty points, and store descriptions of incidents. A student leave request system should also exist where supervisors can approve or reject leave permissions.

For dormitory management, the system must support room management with capacity limits, allowing administrators to assign and monitor which students stay in each room. The system should also include an inventory module to track items owned by the institution such as furniture, books, or dormitory equipment. Inventory items can be distributed to students and tracked in the system.

A key component of the system is the financial and payment management module. Administrators can create payment categories such as monthly tuition (SPP), meal fees, books, or other incidental payments. For recurring payments like monthly tuition, the system should be able to automatically generate monthly bills for each student with details such as amount, discount (if applicable), total payable amount, due date, and payment status.

The platform must integrate with a payment gateway to allow guardians to pay bills online using methods such as e-wallets, virtual accounts, or bank transfers. Each payment transaction should generate a unique order ID, store the payment method, total amount, and transaction status. When a payment is completed, the payment gateway will send a callback to automatically update the bill status to paid without manual verification.

The business model of this system uses a micro-fee per transaction. For example, if the tuition fee is 600,000 IDR, the guardian may pay around 600,500 to 600,900 IDR, where the base amount goes to the institution and the small additional amount becomes the platform’s service fee. The system should log all micro-fee transactions so the platform owner can track total revenue generated from payments.

The platform should also include expense management, allowing administrators to record operational spending such as food supplies, dormitory expenses, or other institutional costs. Financial dashboards should display summaries such as total income from student payments, total expenses, and financial balance within selected time periods.

Additionally, the system should support student savings accounts, where the institution can manage deposits and withdrawals made on behalf of students. Each transaction should be recorded and the student’s balance should update automatically. Guardians should also be able to view their child’s savings balance from their portal.

Finally, the system should provide a dashboard interface that displays key statistics such as total students, guardians, branches, monthly bills, paid vs unpaid payments, and financial charts. The user interface should be clean, modern, and easy to use for school administrators who may not have strong technical backgrounds.

Overall, the platform is designed to become a complete operational management system for Islamic boarding schools, integrating student management, dormitory management, academic records, financial tracking, and automated digital payments while generating revenue through small transaction-based micro fees.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b1eda6fb-74ab-4fd3-8d42-1fc328dc7331).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
