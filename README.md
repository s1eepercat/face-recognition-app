    app.models
    .predict(
    Clarifai.COLOR_MODEL,
        // URL
        "https://samples.clarifai.com/metro-north.jpg"
    )
    .then(function(response) {
        // do something with responseconsole.log(response);
        },
        function(err) {// there was an error}
    );


    Clarifai.FACE_DETECT_MODEL