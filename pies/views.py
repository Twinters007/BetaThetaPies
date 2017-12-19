import json, base64

from .drive import add_order
from .models import Date
from datetime import datetime

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from pies.models import Date
from pytz import timezone

def index(request):
    days = {}
    times = {}
    for date in Date.objects.all():
        day = date.delivery_time.astimezone(timezone('US/Eastern'))
        if date.ordered:
            continue
        if day.date() not in days:
            days[day.date()] = []
        if day.time() not in days[day.date()]:
            days[day.date()].append(day.time())

    days = {k:v for k, v in days.items() if v!=[]}
    times = {str(k.day):v for k, v in days.items()}

    template = loader.get_template('pies/index.html')
    return HttpResponse(template.render({'dates': days, 'times': times, 'keys': times.keys(), 'length': range(len(times))}, request))

@csrf_exempt
@require_POST
def purchase(request):
    jsondata = request.body
    data = json.loads(jsondata)
    note = data['data']['note']
    amount = data['data']['amount']
    settled = data['data']['status'] == 'settled'

    #if not note.startswith('BTPOO'):
    #    return HttpResponse(status=402)
    #if amount < 10 or not settled:
    #    return HttpResponse(status=402)

    order = base64.b64decode(note[5:    ]).decode("utf-8").split(',')
    day = '2018 01 '+ order[4] +' ' + order[5] + 'PM'
    date = datetime.strptime(day, '%Y %m %d %I:%M%p').astimezone(timezone('US/Eastern'))

    for date in Date.objects.filter(delivery_time=date):
        print(date)
        if not date.ordered:
            date.ordered = True
            date.save()
            break

    add_order(order)
    return HttpResponse(status=200)
