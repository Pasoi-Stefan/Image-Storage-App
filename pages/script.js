
const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const uploadButton = document.getElementById('uploadButton');

function getUsername() {

    fetch('http://localhost:3000/photo-deposit/username')
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

    fetch('http://localhost:3000/photo-deposit/upload', {

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

function deleteImage(deleteUrl) {

    fetch(deleteUrl, {
        method: 'DELETE',
    }).then(function () {
        
        listImages();

    })
    .catch(function(err) {

        if(err)
            throw err;

    });
}

function renameImage2(addInput, renameUrl) {

    const postObject = {

        newFilename: addInput.value

    };

    console.log(JSON.stringify(postObject));

    fetch(renameUrl, {

        method: 'put',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)

    }).then(function () {

        console.log('success');

        listImages();

    })
    .catch(function(err) {

        console.log(err);

        if(err)
            throw err;

    });

}

function clearEvents(renameButton) {

    let newrenameButton = renameButton.cloneNode(true);
    renameButton.parentNode.replaceChild(newrenameButton, renameButton);
 
    return newrenameButton;

}

function renameImage1(renameButton, renameUrl, container) {

    var oldFilename = container.children[1].innerHTML;

    container.removeChild(container.children[1]);

    addInput = document.createElement('input');
    addInput.setAttribute('value', oldFilename);
    addInput.setAttribute('type', 'text');

    container.insertBefore(addInput, container.children[1]);

    renameButton = clearEvents(renameButton);
    
    renameButton.addEventListener('click', function() {

        renameImage2(addInput, renameUrl);

    })

}

function listImages() {

    console.log('i tried!');

    fetch('http://localhost:3000/photo-deposit/images')
    .then(function (res) {

        res.json().then(function(images) {

            while (imageList.firstChild) {
                imageList.removeChild(imageList.firstChild);
            }

            for(let i = 0, j = 0 ; i < images.array.length; ++i) {

                const image = images.array[i];

                if(image.belongs) {
                
                    let img = document.createElement('img');
                    img.src = 'image/' + image._id;

                    // image name
                    let imageName = document.createElement('p');
                    imageName.innerHTML = image.filename;

                    // delete button
                    let deleteButton = document.createElement('a')
                    let deleteUrl = 'http://localhost:3000/delete/' + image._id;
                    deleteButton.setAttribute('href', '#');
                    deleteButton.addEventListener('click',  function(){

                        deleteImage(deleteUrl);

                    });
                    deleteButton.innerText = 'Delete';

                    // download button
                    let downloadButton = document.createElement('a');
                    downloadButton.setAttribute('href', '/image/' + image._id);
                    downloadButton.setAttribute('download', image.filename);
                    downloadButton.innerText = 'Download';

                    // rename button
                    let renameButton = document.createElement('a');
                    let renameUrl = 'http://localhost:3000/rename/' + image._id;
                    renameButton.setAttribute('href', '#');
                    renameButton.addEventListener('click',  function(){

                        renameImage1(renameButton, renameUrl, imageList.children[j - 1]);

                    });
                    renameButton.innerText = 'Rename';

                    // div container
                    let container = document.createElement('div');
                    container.setAttribute('class', 'imageHandler');

                    container.appendChild(img);
                    container.appendChild(imageName);
                    container.appendChild(renameButton);
                    container.appendChild(deleteButton);
                    container.appendChild(downloadButton);
            
                    imageList.appendChild(container);

                    ++j;

                }

            }

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
