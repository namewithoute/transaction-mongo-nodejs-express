const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });

//init formated 
var getValue =document.getElementById('balance').innerText
document.getElementById('balance').innerText=formatter.format(getValue)
document.getElementById('total').innerText=formatter.format(getValue)


function getTuitionInfor(studentID){
    var url='http://localhost:3000/get-tuition-infor'
    var string=JSON.stringify(studentID)
    var message=document.getElementById('message')

    console.log(string)
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body:JSON.stringify({studentID:studentID})
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        if(data.type==0 || data.type==2){
            message.innerText=data.message
            message.style.display="block"
            document.getElementById('student-name').placeholder=''
            document.getElementById('tuition-amount').placeholder=''
            document.getElementById('confirm-amount').innerText='0'
            document.getElementById('btn-confirm').disabled =true
            document.getElementById('total').innerText=formatter.format(getValue)

        }
        else{
            message.innerText=''
            document.getElementById('student-name').placeholder=data.studentName
            document.getElementById('tuition-amount').placeholder=formatter.format(data.amountPayable)
            document.getElementById('confirm-amount').innerText=formatter.format(data.amountPayable)
            calBalanceIsValid(getValue,data.amountPayable)
        }
    })
    .catch((err)=>{
        console.log(err)
    })
}

function calBalanceIsValid(balance,tuition){
    var afterPayment=parseInt(balance)-tuition
    var isValid = balance-tuition >=0 ? true : false
    document.getElementById('total').innerText=formatter.format(afterPayment)
    if(isValid){
        document.getElementById('btn-confirm').disabled=false
    }
    else{
        document.getElementById('btn-confirm').disabled=true
        document.getElementById('total').style.color='rgb(209, 69, 69)'
        document.getElementById('alert').style.display='block'
    }
}