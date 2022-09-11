// https://github.com/TryGhost/Portal/blob/main/src/data-attributes.js
function formSubmitHandler({event, form, errorEl, siteUrl, submitHandler}) {
    form.removeEventListener('submit', submitHandler);
    event.preventDefault();
    if (errorEl) {
        errorEl.innerText = '';
    }
    form.classList.remove('success', 'invalid', 'error');
    let emailInput = event.target.querySelector('input[data-members-email]');
    let nameInput = event.target.querySelector('input[data-members-name]');
    // let autoRedirect = form?.dataset?.membersAutoredirect || 'true';
    let autoRedirect = 'true';
    let email = (emailInput || {}).value;
    let name = (nameInput && nameInput.value) || undefined;
    let emailType = undefined;
    let labels = [];

    let labelInputs = event.target.querySelectorAll('input[data-members-label]') || [];
    for (let i = 0; i < labelInputs.length; ++i) {
        labels.push(labelInputs[i].value);
    }

    if (form.dataset.membersForm) {
        emailType = form.dataset.membersForm;
    }

    if (form.dataset.siteUrl) {
        siteUrl = form.dataset.siteUrl;
    }

    form.classList.add('loading');

    fetch(`${siteUrl}/members/api/send-magic-link/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            emailType: emailType,
            labels: labels,
            name: name,
            autoRedirect: (autoRedirect === 'true')
        })
    }).then(function (res) {
        form.addEventListener('submit', submitHandler);
        form.classList.remove('loading');
        if (res.ok) {
            form.classList.add('success');
        } else {
            if (errorEl) {
                errorEl.innerText = 'There was an error sending the email, please try again';
            }
            form.classList.add('error');
        }
    });
}

Array.from(document.querySelectorAll('form[data-members-form]')).forEach(function (form) {
    const submitHandler = form.addEventListener('submit', function (event) {
        event.preventDefault();
        formSubmitHandler({
            event,
            errorEl: form.querySelector('[data-members-error]'),
            form,
            siteUrl: '',
            submitHandler,
        });
    });
});
