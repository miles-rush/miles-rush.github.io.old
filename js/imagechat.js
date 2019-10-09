Bmob.initialize("b74ac2feaf9f7003", "888888");

$(document).ready(function() {
    $(function () {
        function chooseImage(fileid, imgid, fileValId) {
            var fileObj = document.getElementById(fileid); 
            if (typeof (fileObj) == "undefined" || fileObj.files.length == 0) {
                 console.log('file ' + fileid + ' not exists');
                 return;
            }
            var file = fileObj.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            //save base64 code 
            var smaller = document.getElementById("small").value;
            alert(smaller);
            reader.onload = function (e) {
                let image = new Image() //新建一个img标签（还没嵌入DOM节点)
                image.src = e.target.result
                image.onload = function() {
                    let canvas = document.createElement('canvas'), 
                    context = canvas.getContext('2d'),
                    imageWidth = image.width / 3,    //压缩后图片的大小
                    imageHeight = image.height / 3,
                    data = ''

                    canvas.width = imageWidth
                    canvas.height = imageHeight

                    context.drawImage(image, 0, 0, imageWidth, imageHeight)
                    data = canvas.toDataURL('image/jpeg')

                    //压缩完成 
                    saveImage(data);
                }           
            };
        };

        function saveImage(base64img) {
            const query = Bmob.Query('images');
            query.set("base64img", base64img)
            query.save().then(res => {
                alert("success");
                console.log(res);
            }).catch(err => {
                alert("err");
                console.log(err);
            })
        }

        function downlaodImages() {
            const query = Bmob.Query("images");
            query.select("objectId");
            query.find().then(res => {
                document.getElementById('list').innerHTML = "";
                for(var i=0;i<res.length;i++) {
                    const inner = Bmob.Query('images');
                    inner.get(res[i].objectId).then(res => {
                        console.log(res);
                        var myParent = document.getElementById("list"); 
                        var myImage = document.createElement("img");
                        var infoText = document.createTextNode(res.createdAt);
                        var brDiv = document.createElement('br');
                        myImage.setAttribute("src", res.base64img);
                        myParent.appendChild(myImage);
                        myParent.appendChild(brDiv);
                        //myParent.appendChild(infoText);
                        myParent.appendChild(brDiv);
                    }).catch(err => {
                        console.log(err);
                    })
                }
                console.log(res);
                
                
            });
        }

        function showImage(base64img, imgid, fileValId) {
            var imgObj = document.getElementById(imgid);
            if (typeof (imgObj) != "undefined") {
                imgObj.setAttribute("src", imgResult);
            }
            var fileValObj = document.getElementById(fileValId);
            if (typeof (fileValObj) != "undefined") {
                fileValObj.setAttribute("value", imgResult);
            }
        }

        function deleteImages() {
            const query = Bmob.Query("images");
            query.select("objectId");
            query.find().then(res => {
                for(var i=0;i<res.length;i++) {
                    const query = Bmob.Query('images');
                    query.destroy(res[i].objectId).then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            });
            alert("清除库中图片数据");
        }

        $('#file').on('change', function () {
            chooseImage('file', 'photo', 'fileVal');
        });

        $('#download').on('click', function() {
            downlaodImages();
        })

        $('#delete').on('click', function() {
            deleteImages();
        })
    });
    
});