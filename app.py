from flask import Flask , render_template , session , request, jsonify

app = Flask(__name__)
app.secret_key = '@MAHAKALI@THUNAI'

@app.route("/")
def Login():
    return render_template("login/index.html")


ROLES = {
    "Admin":"dashboard/admin.html",
    "Student":"dashboard/student.html"
}

@app.route('/<role>')
def Dashboard(role):
    role_data = ROLES[role]
    if not role_data:
        return "Error !"
    print(session.get("role"))
    if session.get("role") == "Student" and role == 'Admin':
        return render_template("dashboard/student.html")
    elif session.get("role") == "Admin" and role == "Student":
        return render_template("dashboard/admin.html")
    
    return render_template(role_data)



@app.route("/set-cookie" , methods=['POST'])
def Set_Cookie():
    try:
        role = request.json.get("role")
        if not role:
            return jsonify({"Success":False, "Error":"Pls Provide the Student or admin Role"}) , 400
        
        session['role'] = role
        return jsonify({"Success":True})
    except:
        return jsonify({"Success":False})

        
if __name__ == "__main__":
    app.run(debug=True , port=1212)