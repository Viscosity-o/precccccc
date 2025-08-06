from django.shortcuts import render
from .models import ngorequests
from auther.models import customuser, ngo
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from .models import ngorequests

@login_required
def ngo_requests(request):
    requests = ngorequests.objects.filter(ngo__user=request.user)
    
    
    return render(request, 'ngofunc/ngo_requests.html', {'requests': requests})

def create_ngo_request(request):
    tag_choices = ngorequests._meta.get_field('tag').choices  # get choices dynamically from model

    if request.method == 'POST':
        tag = request.POST.get('tag')
        title = request.POST.get('title')
        amount = request.POST.get('amount')
        usersissuing = request.POST.get('usersissuing')

        ngo_instance = ngo.objects.get(user=request.user)

        new_request = ngorequests(
            tag=tag,
            ngo=ngo_instance,
            title=title,
            amount=amount,
            usersissuing=usersissuing
        )
        new_request.save()

        return redirect('ngo_requests')

    return render(request, 'ngofunc/create_ngo_request.html', {'tag_choices': tag_choices})