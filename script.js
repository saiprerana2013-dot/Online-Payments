
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTS
    // =========================================

    const authPage = document.getElementById("authPage");
    const dashboard = document.getElementById("dashboard");

    const loginView = document.getElementById("loginView");
    const registerView = document.getElementById("registerView");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const notification = document.getElementById("notification");

    let notificationTimer;


    // =========================================
    // NOTIFICATION
    // =========================================

    function showMessage(message) {

        notification.textContent = message;

        notification.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(function () {
            notification.classList.remove("show");
        }, 4000);

    }


    // =========================================
    // SWITCH BETWEEN LOGIN AND REGISTER
    // =========================================

    document.getElementById("openRegister").addEventListener(
        "click",
        function () {

            loginView.classList.add("hidden");
            registerView.classList.remove("hidden");

        }
    );

    document.getElementById("openLogin").addEventListener(
        "click",
        function () {

            registerView.classList.add("hidden");
            loginView.classList.remove("hidden");

        }
    );


    // =========================================
    // SHOW / HIDE PASSWORD
    // =========================================

    document.querySelectorAll(".show-password").forEach(function (button) {

        button.addEventListener("click", function () {

            const input = document.getElementById(button.dataset.target);

            if (input.type === "password") {

                input.type = "text";
                button.textContent = "Hide";

            } else {

                input.type = "password";
                button.textContent = "Show";

            }

        });

    });


    // =========================================
    // ACCOUNT STORAGE
    // DEMO ONLY — NOT FOR REAL AUTHENTICATION
    // =========================================

    const ACCOUNT_KEY = "payease_demo_account";
    const SESSION_KEY = "payease_demo_session";


    function getAccount() {

        try {

            const stored = localStorage.getItem(ACCOUNT_KEY);

            return stored ? JSON.parse(stored) : null;

        } catch (error) {

            return null;

        }

    }


    function saveAccount(account) {

        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));

    }


    // =========================================
    // REGISTRATION
    // =========================================

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName")
            .value.trim();

        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("registerPassword")
            .value;

        const termsAccepted = document.getElementById("acceptTerms")
            .checked;


        if (!name || !email || password.length < 8) {

            showMessage("Please complete all fields correctly.");

            return;

        }


        if (!termsAccepted) {

            showMessage("Please accept the demo terms of use.");

            return;

        }


        const existingAccount = getAccount();

        if (existingAccount && existingAccount.email === email) {

            showMessage(
                "A demo account with this email already exists. Please sign in."
            );

            return;

        }


        /*
          This demo stores the password in browser storage.
          Never store plain-text passwords in a real application.
          Production authentication must use a secure backend.
        */

        const account = {
            name: name,
            email: email,
            password: password
        };


        try {

            saveAccount(account);

        } catch (error) {

            showMessage(
                "Account could not be saved. Check browser storage settings."
            );

            return;

        }


        registerForm.reset();

        document.getElementById("loginEmail").value = email;

        document.getElementById("loginPassword").value = "";

        registerView.classList.add("hidden");

        loginView.classList.remove("hidden");

        showMessage(
            "Demo account created. Sign in using your new details."
        );

    });


    // =========================================
    // LOGIN
    // =========================================

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword")
            .value;

        const account = getAccount();


        if (!account) {

            showMessage(
                "No demo account found. Please create an account first."
            );

            return;

        }


        if (
            account.email !== email ||
            account.password !== password
        ) {

            showMessage("Email or password is incorrect.");

            return;

        }


        try {

            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify({
                    email: account.email,
                    loggedIn: true
                })
            );

        } catch (error) {

            showMessage("Unable to start the demo session.");

            return;

        }


        openDashboard(account);

        loginForm.reset();

    });


    // =========================================
    // OPEN DASHBOARD
    // =========================================

    function openDashboard(account) {

        authPage.classList.add("hidden");

        dashboard.classList.remove("hidden");

        const displayName = account.name || "User";

        document.getElementById("userName").textContent =
            displayName;

        document.getElementById("welcomeHeading").textContent =
            "Welcome back, " + displayName.split(" ")[0] + "!";

        document.getElementById("userAvatar").textContent =
            displayName.charAt(0).toUpperCase();

        document.getElementById("currentDate").textContent =
            new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            }).format(new Date());

        window.scrollTo(0, 0);

        showMessage("Welcome to your PayEase dashboard!");

    }


    // =========================================
    // LOGOUT
    // =========================================

    document.getElementById("logoutButton").addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(SESSION_KEY);

            dashboard.classList.add("hidden");

            authPage.classList.remove("hidden");

            loginView.classList.remove("hidden");

            registerView.classList.add("hidden");

            window.scrollTo(0, 0);

            showMessage("You have logged out of the demo.");

        }
    );


    // =========================================
    // BILL PAYMENT SERVICES
    // =========================================

    document.querySelectorAll("[data-service]").forEach(function (button) {

        button.addEventListener("click", function () {

            const service = button.dataset.service;

            showMessage(
                service +
                " selected. Connect an authorized payment provider to process real bills."
            );

        });

    });


    // =========================================
    // POS ENQUIRIES
    // =========================================

    document.querySelectorAll("[data-product]").forEach(function (button) {

        button.addEventListener("click", function () {

            const product = button.dataset.product;

            const email = "hello@example.com";

            const subject = encodeURIComponent(
                "PayEase POS enquiry: " + product
            );

            const body = encodeURIComponent(
                "Hello PayEase Team,\n\n" +
                "I would like to enquire about " + product + ".\n\n" +
                "Please share more information.\n\nThank you."
            );

            window.location.href =
                "mailto:" + email +
                "?subject=" + subject +
                "&body=" + body;

        });

    });


    // =========================================
    // FORGOT PASSWORD DEMO
    // =========================================

    document.getElementById("forgotPassword").addEventListener(
        "click",
        function () {

            showMessage(
                "Password recovery needs a verified email and a secure backend."
            );

        }
    );


    // =========================================
    // COPYRIGHT
    // =========================================

    document.getElementById("copyrightYear").textContent =
        new Date().getFullYear();


    // =========================================
    // RESTORE DEMO SESSION
    // =========================================

    try {

        const session = JSON.parse(
            sessionStorage.getItem(SESSION_KEY) || "null"
        );

        const account = getAccount();

        if (
            session &&
            session.loggedIn === true &&
            account &&
            session.email === account.email
        ) {

            openDashboard(account);

        }

    } catch (error) {

        sessionStorage.removeItem(SESSION_KEY);

    }

});

