
const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const uploadButton = document.getElementById('uploadButton');

function getUsername() {

    fetch('http://localhost:3000/greyscale/username')
        .then(function(res) {

            res.json().then(function(Username) {

                var username = document.getElementById('username');
                username.innerHTML = 'Username: ' + Username.username;

            })

        });

}

function uploadImage() {

    var formData = new FormData();
    var file = imageInput.files[0];
    formData.append('image', file);

    fetch('http://localhost:3000/greyscale/upload', {

        method: 'post',
        body: formData

    }).then(function () {

        imageInput.value = '';

        listImages();

    })
    .catch(function(err) {

        if(err)
            throw err;

    });

}

function deleteImage(url){

    fetch(url, {
        method: 'DELETE',
    }).then(function () {
        
        listImages();

    });

}

function listImages() {

    console.log('i tried!');

    fetch('http://localhost:3000/greyscale/images')
    .then(function (res) {

        res.json().then(function(images) {

            while (imageList.firstChild) {
                imageList.removeChild(imageList.firstChild);
            }

            images.array.forEach(function(image) {
                if(image.belongs) {
                
                    let img = document.createElement('img');
                    img.src = 'image/' + image._id;

                    console.log(img.src);

                    // image name
                    let imageName = document.createElement('p');
                    imageName.innerHTML = image.filename;

                    // delete button
                    let deleteButton = document.createElement('a')
                    let deleteUrl = 'http://localhost:3000/delete/' + image._id;
                    deleteButton.addEventListener('click',  function(){

                        deleteImage(deleteUrl);

                    });
                    deleteButton.innerText = 'Delete';

                    // download button
                    let downloadButton = document.createElement('a');
                    let downloadUrl = 'http://localhost:3000/greyscale/image/' + image._id;
                    downloadButton.setAttribute('href', '/image/' + image._id);
                    downloadButton.setAttribute('download', image.filename);
                    downloadButton.innerText = 'Download';

                    // div container
                    let container = document.createElement('div');
                    container.appendChild(img);
                    container.appendChild(imageName);
                    container.appendChild(deleteButton);
                    container.appendChild(downloadButton);
            
                    imageList.appendChild(container);

                }

            });

        });

    })
    .catch(function(err) {

        if(err)
            throw err;

    });

}



getUsername();

uploadButton.addEventListener('click', uploadImage);

listImages();
