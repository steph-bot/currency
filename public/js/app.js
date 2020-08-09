window.addEventListener('load', () => {
    const el = $('#app');

    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const ratesTemplate = Handlebars.compile($('#rates-template').html());
    const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
    const historicalTemplate = Handlebars.compile($('#historical-template').html());

    // const html = ratesTemplate();
    // el.html(html);

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                color: 'yellow',
                title: 'Error 404 - Page NOT Found!',
                message: `The path '/${path}' does not exist on this site`,
            });
            el.html(html);
        },
    });

    // router.add('/', () => {
    //     let html = ratesTemplate();
    //     el.html(html);
    // });

    // Instantiate api handler (api client for communicating with proxy server)
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 5000,
    });

    // Display Error Banner (if server-side failure)
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message });
        el.html(html);
    };

    // Display Latest Currency Rates
    //
    // Get rates data from the localhost:3000/api/rates endpoint 
    // and pass it to the rates-template to display the information.
    router.add('/', async () => {
        // Display loader first
        let html = ratesTemplate();
        el.html(html);
        try {
            // Load Currency Rates
            const response = await api.get('/rates');
            const { base, date, rates } = response.data;
            // Display Rates Table
            html = ratesTemplate({ base, date, rates });
            el.html(html);
        } catch (error) {
            showError(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    });

    // router.add('/exchange', () => {
    //     let html = exchangeTemplate();
    //     el.html(html);
    // });

    // Perform POST request, calculate and display conversion results
    const getConversionResults = async () => {
        // Extract form data
        const from = $('#from').val();
        const to = $('#to').val();
        const amount = $('#amount').val();
        // Send post data to Express(proxy) server
        try {
            const response = await api.post('/convert', { from, to });
            const { rate } = response.data;
            const result = rate * amount;
            $('#result').html(`${to} ${result}`);
        } catch (error) {
            showError(error);
        } finally {
            $('#result-segment').removeClass('loading');
        }
    };

    // Perform POST request, calculate and display simulation results
    const getSimulationResults = async () => {
        // Extract form data
        const timeWindow = $('#timeWindow').val();
        const coneTimeMean = $('#coneTimeMeanMins').val();
        const coneTimeStdDevMins = $('#coneTimeStdDevMins').val();
        const custArrivalMeanMins = $('#custArrivalMeanMins').val();
        const simRuns = $('#simRuns').val();

        // Send post data to Express(proxy) server
        try {
            const response = await api.post('/simulate', { 
                timeWindow, 
                coneTimeMean, 
                coneTimeStdDevMins, 
                custArrivalMeanMins, 
                simRuns 
            });
            console.log(response);
            const { meanWaitTimeForVIP } = response.data;
            const result = meanWaitTimeForVIP;
            $('#result2').html(`${result}`);
        } catch (error) {
            showError(error);
        } finally {
            $('#result-segment2').removeClass('loading');
        }
    };

    // Handle Simulation Button Click Event
    const simulationHandler = () => {
        if ($('.ui.form').form('is valid')) {
            // hide error message
            $('.ui.error.message').hide();
            // Post to Express server
            // $('#result-segment').addClass('loading');
            $('#result-segment2').addClass('loading');
            // getConversionResults();
            getSimulationResults();
            // Prevent page from submitting to server
            return false;
        }
        return true;
    };

    router.add('/exchange', async () => {
        // Display loader first
        let html = exchangeTemplate();
        el.html(html);
        try {
            // Load Symbols
            /*
            const response = await api.get('/symbols');
            const { symbols } = response.data;
            html = exchangeTemplate({ symbols });
            el.html(html);
            */
            $('.loading').removeClass('loading');
            
            // Validate Form Inputs
            $('.ui.form').form({
                fields: {
                    timeWindow: ['empty', 'number'],
                    coneTimeMeanMins: ['empty', 'number'],
                    coneTimeStdDevMins: ['empty', 'number'],
                    custArrivalMeanMins: ['empty', 'number'],
                    simRuns: 'integer',
                },
            });
            // Specify Submit Handler
            $('.submit').click(simulationHandler);
        } catch (error) {
            showError(error);
        }
    });

    router.add('/historical', () => {
        let html = historicalTemplate();
        el.html(html);
    });

    // Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('a').on('click', (event) => {
        // Block browser page load
        event.preventDefault();

        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });
});
