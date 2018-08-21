var last = "25";


$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $.ajax({
        url: '/times',
        type: 'GET',
        error: function () {
            $('#datepicker').pickadate({min: [2018, 9, 13], max: [2018, 9, 15]}).pickadate('picker').set({disable: true});
            $('#timepicker').pickatime({
                min: [19, 0],
                max: [22, 0],
                interval: 15,
                disabled: true
            }).pickatime('picker').set({disable: true});
        },
        success: function(data) {
            var dates = [];
            newData = JSON.parse(data);
            dates.push(true);
            for (let i = 0; i < newData.length-1; i++){
                dates.push(new Date(newData[i]));
            }
            var timepicker = $('#timepicker').pickatime({
                min: [19, 0],
                max: [22, 0],
                interval: 15
            }).pickatime('picker');
            var datepicker = $('#datepicker').pickadate({
                min: dates[1],
                max: dates[dates.length - 1],
                disable: dates,
                formatSubmit: "m/d/yyyy",
                hiddenName: true,
                format: "mmm d",
                onSet: function(thingset){
                    timepicker.set('disable', false);
                    var selectedDayTimes = JSON.parse(data).filter(date => new Date(date).getDate() === new Date(thingset.select).getDate());
                    selectedDayTimes = selectedDayTimes.map((date, index, array) => [new Date(date).getHours(),new Date(date).getMinutes()]);
                    selectedDayTimes.unshift(true);
                    timepicker.set('disable', selectedDayTimes);
                    timepicker.set('disable', 'flip');
                }
            }).pickadate('picker');
            datepicker.set('select', dates[1]);



        },
        timeout: 10000
    });

    $('.toppingsIcon').click(function () {
        $('img', this).toggleClass('deselected');
        $('#'+(this.id.split('-')[0])).fadeToggle(1000);
    })
});

function pay() {
    const name = $('#name').val().replace(',', ' ');
    const addr = $('#address').val().replace(',', ' ');
    const cell = $('#cellnumber').val();
    let toppings = "";
    $('#crust').children().each((i) => {
        console.log(this.id);
        if ($(this).is(":visible")){
            toppings+=this.id+"/";
        }
    });

    const toppingsum = toppings.slice(0,-1);
    const day = $('#datepicker').pickadate('picker').get('value', 'd/m/yyyy');
    const time = $('#timepicker').pickatime('picker').get('value', 'H:i');
    const comments = $('#comments').val().replace(',', ' ');
    const note = name+','+addr+','+cell+','+toppingsum+','+day+','+time+','+comments;
    console.log(note);
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO'+note+'&amount=10', '_blank');
}


// function random(){
//     rand = Math.floor(Math.random() * 252) + 3;
//     console.log(rand);
//     for(i = 2; i <= 7; i++){
//         if( (1 << i) & rand){
//             $('#toppingsinput-' + i).prop('checked', true)
//         }
//         else{
//             $('#toppingsinput-' + i).prop('checked', false)
//         }
//     }
// }
