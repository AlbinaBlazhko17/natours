const $a01ad5087aa0d30d$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $a01ad5087aa0d30d$export$de026b00723010c1 = (type, msg)=>{
    $a01ad5087aa0d30d$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($a01ad5087aa0d30d$export$516836c6a9dfc573, 5000);
};


const $fc10e26cb3b809cc$export$66791fb2cfeec3e = async (email)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/forgotPassword",
            data: {
                email: email
            }
        });
        if (res.data.status === "success") {
            (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", "Reset password has been sent to your email!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err.response.message);
    }
};



const $71aa1b7eb6279560$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            credentials: "include",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", "Logged in successfully!");
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err.response.data.message);
    }
};
const $71aa1b7eb6279560$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            credentials: "include",
            url: "/api/v1/users/logout"
        });
        if (res.data.status === "success") {
            (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", "Logged out successfully!");
            location.reload(true);
        // window.setTimeout(() => {
        // 	location.assign('/');
        // }, 1500);
        }
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err);
    }
};


const $ec62aceef3f8b9ee$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoiYWxiaW5hdG9yMTcwNyIsImEiOiJjbGpwY3Z5NjcwMDNnM25tdmVhb3UwNng4In0.XsaRBpx7PndslhJ8mOVq9Q";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/albinator1707/cljpd19fx00t501qy2jmebgjq",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};



const $13c34e71768beb7a$export$6503ec6e8aabbaf = async (name, email, password, passwordConfirm)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                name: name,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            }
        });
        if (res.data.status === "success") (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", "Registered successfully!");
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err.response.data.message);
    }
};



const $8bc100f925d8cfe6$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
        const res = await axios({
            method: "PATCH",
            url: url,
            data: data
        });
        if (res.data.status === "success") {
            (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", `${type.toUpperCase()} are successfully updated`);
            if (type === "photo") return res.data.data.user.photo;
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err.response.data.message);
    }
};



const $fd944b9ccce9270a$export$dc726c8e334dd814 = async (password, passwordConfirm)=>{
    try {
        const res = await axios({
            method: "PATCH",
            url: `/api/v1/users/resetPassword/${window.location.pathname.split("/")[2]}`,
            data: {
                password: password,
                passwordConfirm: passwordConfirm
            }
        });
        if (res.data.status === "success") {
            (0, $a01ad5087aa0d30d$export$de026b00723010c1)("success", "Password has been successfully reset!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err.response.data.message);
    }
};



const $f56938ec597dd420$export$8d5bdbf26681c0c2 = async (tourId)=>{
    const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
    try {
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        (0, $a01ad5087aa0d30d$export$de026b00723010c1)("error", err);
    }
};


const $b6f4712e4c6c8e18$var$mapBox = document.getElementById("map");
const $b6f4712e4c6c8e18$var$loginForm = document.querySelector(".login-form");
const $b6f4712e4c6c8e18$var$registerForm = document.querySelector(".register-form");
const $b6f4712e4c6c8e18$var$logOutBtn = document.querySelector(".nav__el--logout");
const $b6f4712e4c6c8e18$var$formUserData = document.querySelector(".form-user-data");
const $b6f4712e4c6c8e18$var$formUserPassword = document.querySelector(".form-user-password");
const $b6f4712e4c6c8e18$var$fileInput = document.querySelector(".form__upload");
const $b6f4712e4c6c8e18$var$passwordForgotForm = document.querySelector(".forgot-form");
const $b6f4712e4c6c8e18$var$passwordResetForm = document.querySelector(".reset-form");
const $b6f4712e4c6c8e18$var$bookBtn = document.getElementById("book-tour");
if ($b6f4712e4c6c8e18$var$mapBox) {
    const locations = JSON.parse($b6f4712e4c6c8e18$var$mapBox.dataset.locations);
    (0, $ec62aceef3f8b9ee$export$4c5dd147b21b9176)(locations);
}
if ($b6f4712e4c6c8e18$var$loginForm) $b6f4712e4c6c8e18$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $71aa1b7eb6279560$export$596d806903d1f59e)(email, password);
});
if ($b6f4712e4c6c8e18$var$registerForm) $b6f4712e4c6c8e18$var$registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    (0, $13c34e71768beb7a$export$6503ec6e8aabbaf)(name, email, password, passwordConfirm);
});
if ($b6f4712e4c6c8e18$var$logOutBtn) $b6f4712e4c6c8e18$var$logOutBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    (0, $71aa1b7eb6279560$export$a0973bcfe11b05c9)();
});
if ($b6f4712e4c6c8e18$var$formUserData) $b6f4712e4c6c8e18$var$formUserData.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    (0, $8bc100f925d8cfe6$export$f558026a994b6051)(form, "data");
});
if ($b6f4712e4c6c8e18$var$fileInput) $b6f4712e4c6c8e18$var$fileInput.addEventListener("change", async (e)=>{
    const form = new FormData();
    form.append("photo", document.getElementById("photo").files[0]);
    const newImage = await (0, $8bc100f925d8cfe6$export$f558026a994b6051)(form, "photo");
    if (newImage) {
        document.querySelector(".nav__user-img").setAttribute("src", `/img/users/${newImage}`);
        document.querySelector(".form__user-photo").setAttribute("src", `/img/users/${newImage}`);
    }
});
if ($b6f4712e4c6c8e18$var$formUserPassword) $b6f4712e4c6c8e18$var$formUserPassword.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-password").innerHTML = "Updating...";
    const email = document.getElementById("email").value;
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await (0, $8bc100f925d8cfe6$export$f558026a994b6051)({
        email: email,
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
    }, "password");
    document.querySelector(".btn--save-password").innerHTML = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});
if ($b6f4712e4c6c8e18$var$passwordForgotForm) $b6f4712e4c6c8e18$var$passwordForgotForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    (0, $fc10e26cb3b809cc$export$66791fb2cfeec3e)(email);
});
if ($b6f4712e4c6c8e18$var$passwordResetForm) $b6f4712e4c6c8e18$var$passwordResetForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    (0, $fd944b9ccce9270a$export$dc726c8e334dd814)(password, passwordConfirm);
});
if ($b6f4712e4c6c8e18$var$bookBtn) $b6f4712e4c6c8e18$var$bookBtn.addEventListener("click", (e)=>{
    e.target.textContent = "Processing...";
    const { tourId: tourId } = e.target.dataset;
    (0, $f56938ec597dd420$export$8d5bdbf26681c0c2)(tourId);
});


//# sourceMappingURL=bundle.js.map
