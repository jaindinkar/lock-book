import json

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError

from django.contrib.auth import authenticate, login, logout

from . models import CustomUser, Key
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from . passwd_generator import pass_gen


# Create your views here.

def index(request):
    return render(request, "lock_book/index.html", {
        "passwd": pass_gen(),
    })



def new_pass(request):
    return JsonResponse({"pass": f"{pass_gen()}"}, status=201)


@login_required
def key_holder(request):
    if(request.user.is_authenticated):
        userKeys = Key.objects.filter(key_creator=request.user)
        return render(request, "lock_book/key_holder.html", {
            "userKeys": userKeys,
        })


# @csrf_exempt
@login_required
def key_save(request):
    if request.method == "POST":
        # Extract the data from the request.
        data = json.loads(request.body)
        
        site_addr = data.get("site_addr")
        password = data.get("password")
        email = data.get("email")
        username = data.get("username")
        # comments = data.get("comments") , comments=comments
        # return JsonResponse({"message": "Update successful."}, status=201)

        # Check if passwd and site_addr are provided or not.
        if (password == "" or site_addr == ""):
            return JsonResponse({"error": "Insufficient data - site-addr and pass are required fields"}, status=400)

        # Attempt to create new user
        try:
            newKey = Key(key_creator=request.user, site_addr=site_addr, password=password, email_addr=email, user_name=username, comments = "")
            newKey.save()
        except IntegrityError:
            return JsonResponse({"error": "Server database integrity error"}, status=400)
        except ValueError:
            return JsonResponse({"error": "Server value error"}, status=400)
        
        return JsonResponse({"message": "Update successful."}, status=201)



# @csrf_exempt
@login_required
def key_delete(request):
    if request.method == "POST":
        # Extract the data from the request.
        data = json.loads(request.body)
        key_id = data.get("key_id")

        # Check for the validity of key. Exists or not. Invalid Request
        try:
            key = Key.objects.get(pk=key_id)
        except DoesNotExist:
            return JsonResponse({"error": "Invalid Request - Key does not exist."}, status=400)

        # Check for if the key belongs to current user or not. Unauthorized Request
        if (request.user != key.key_creator):
            return JsonResponse({"error": "Unauthorized Request - Current user is not allowed to make this request."}, status=400)

        # Procced Deleting.
        key.delete()
        return JsonResponse({"message": "Update successful."}, status=201)



def register(request):
    if request.method == "POST":
        
        f_name = request.POST["fname"]
        l_name = request.POST["lname"]
        email = request.POST["email"]
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if (f_name == "" or l_name == ""):
            return render(request, "lock_book/register.html", {
                "message": "First and Last name cannot be empty."
            })

        if password != confirmation:
            return render(request, "lock_book/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = CustomUser.objects.create_user(first_name=f_name, last_name=l_name, email=email, password=password)
            user.save()
        except IntegrityError:
            return render(request, "lock_book/register.html", {
                "message": "Email address already taken."
            })
        except ValueError:
            return render(request, "lock_book/register.html", {
                "message": "Email address is required."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "lock_book/register.html")



def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, email=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "lock_book/login.html", {
                "message": "Invalid email or password."
            })
    else:
        return render(request, "lock_book/login.html")


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
