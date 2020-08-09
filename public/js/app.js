window.addEventListener('load', () => {
    const el = $('#app');

    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const simulationTemplate = Handlebars.compile($('#simulation-template').html());

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

    // Instantiate api handler (api client for communicating with proxy server)
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 0, // Do not time out requests.
    });

    // Display Error Banner (Server-Side Failure)
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message });
        el.html(html);
    };

    // Perform POST Request: Calculate and Display Simulation Results
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

    // Handle "Run Simulation" Button Click Event
    const simulationHandler = () => {
        if ($('.ui.form').form('is valid')) {
            // hide error message
            $('.ui.error.message').hide();
            // Post to Express server
            $('#result-segment2').addClass('loading');
            // getConversionResults();
            getSimulationResults();
            // Prevent page from submitting to server
            return false;
        }
        return true;
    };

    router.add('/', async () => {
        // Display loader first
        let html = simulationTemplate();
        el.html(html);
        try {
            // Load Symbols
            const response = await api.get('/symbols');
            const { symbols } = response.data;
            html = simulationTemplate({ symbols });
            el.html(html);
            $('.loading').removeClass('loading');
            // Validate Form Inputs
            $('.ui.form').form({
                fields: {
                    timeWindow: ['number', 'empty'],
                    simRuns: ['number', 'empty'],
                    coneTimeMeanMins: ['number', 'empty'],
                    coneTimeStdDevMins: ['number', 'empty'],
                    custArrivalMeanMins: ['number', 'empty']
                },
            });
            // Specify Submit Handler
            $('.submit').click(simulationHandler);
        } catch (error) {
            showError(error);
        }
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
