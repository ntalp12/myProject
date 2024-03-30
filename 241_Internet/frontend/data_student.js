const BASE_URL = 'http://localhost:3000'

window.onload = async() => {
    await loadData()
}
const loadData = async() => {
console.log('on load')
    // 1. load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/education`)
    console.log(response.data)

    // 2. นำ user ที่โหลดมาได้ใส่กลับเข้าไปใน html
    const educationDOM = document.getElementById('education')
    let htmlData = '<div>'
    htmlData += '<table><thead><tr><th>id</th><th>ชื่อ</th><th>นามสกุล</th><th>อายุ</th><th>ที่อยู่</th><th>ระดับการศึกษา</th><th>CRUD</th></tr></thead><tbody>'
    for (let i = 0; i < response.data.length; i++) {
        let education = response.data[i]
        htmlData += `<div>
            <tr>
                <td>${education.id}</td>
                <td>${education.fname}</td>
                <td>${education.lname}</td>
                <td>${education.age}</td>
                <td>${education.address}</td>
                <td>${education.degree}</td>
                <td><a href='index.html?id=${education.id}'><button id='editMode'>Edit</button></a>
                <button id='deleteMode' class='delete' data-id='${education.id}'>Delete</button></td>
            </tr>
        </div>`
    }
    htmlData += '</tbody></thead></table></div>'
    educationDOM.innerHTML = htmlData

    const deleteDOMs = document.getElementsByClassName('delete')
    for(let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async(event) => {
            //ดึงค่า id จาก attribute ของปุ่ม delete
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/education/${id}`)
                loadData() //recursive function = เรียก function ตัวเอง
            } catch (error) {
                console.log(error)
            }
        })
    }
}