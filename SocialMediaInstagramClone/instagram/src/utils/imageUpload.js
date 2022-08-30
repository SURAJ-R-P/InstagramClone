export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    if(file.size > 2048 * 2048) //1mb
    err = "The image size should be less than 2mb."

    if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Image format is incorrect."

    return err;
}

export const imageUpload = async (images) => {
    // console.log(images)
    let imgArr = [];
    for (const item of images){
        // console.log(item)
        const formData = new FormData()

        if(item.camera){
            formData.append("file", item.camera)
        }else{
            formData.append("file", item)
        }
    
        formData.append("upload_preset", "nvzhocdb")
        formData.append("cloud_name","instchat")

        const response = await fetch("https://api.cloudinary.com/v1_1/instchat/upload", {
            method: "POST",
            body: formData
        })

        const data = await response.json()
        // console.log(data)
        imgArr.push({public_id: data.public_id, url: data.secure_url})
    }
    return imgArr;
}