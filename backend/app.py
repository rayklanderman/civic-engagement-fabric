from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/bills', methods=['GET'])
def get_bills():
    # Sample data - in a real app, this would come from a database
    bills = [
        {
            "id": "1",
            "title": "County Finance Bill 2024",
            "description": "Proposed financial allocations for the fiscal year 2024/2025",
            "county": "Nairobi",
            "deadline": "2024-03-30"
        },
        {
            "id": "2",
            "title": "Healthcare Services Bill",
            "description": "Regulations for private and public healthcare facilities",
            "county": "Mombasa",
            "deadline": "2024-04-15"
        }
    ]
    return jsonify(bills)

if __name__ == '__main__':
    app.run(debug=True, port=5000)