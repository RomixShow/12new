import requests
import sys
from datetime import datetime
import json

class AichinAPITester:
    def __init__(self, base_url="https://rusintl-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())[:5]}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_services_endpoints(self):
        """Test services endpoints"""
        success, services = self.run_test("Get All Services", "GET", "services", 200)
        
        if success and services:
            # Test individual service endpoint with first service
            if len(services) > 0 and 'slug' in services[0]:
                slug = services[0]['slug']
                self.run_test(f"Get Service: {slug}", "GET", f"services/{slug}", 200)
            else:
                print("⚠️  No services found or missing slug field")
        
        return success

    def test_cases_endpoints(self):
        """Test case studies endpoints"""
        success, cases = self.run_test("Get All Cases", "GET", "cases", 200)
        
        if success and cases:
            # Test individual case endpoint
            if len(cases) > 0 and 'slug' in cases[0]:
                slug = cases[0]['slug']
                self.run_test(f"Get Case: {slug}", "GET", f"cases/{slug}", 200)
            else:
                print("⚠️  No cases found or missing slug field")
        
        return success

    def test_events_endpoints(self):
        """Test events endpoints"""
        success, events = self.run_test("Get All Events", "GET", "events", 200)
        
        if success and events:
            # Test individual event endpoint
            if len(events) > 0 and 'slug' in events[0]:
                slug = events[0]['slug']
                self.run_test(f"Get Event: {slug}", "GET", f"events/{slug}", 200)
            else:
                print("⚠️  No events found or missing slug field")
        
        return success

    def test_projects_endpoints(self):
        """Test investment projects endpoints"""
        success, projects = self.run_test("Get All Projects", "GET", "projects", 200)
        
        if success and projects:
            # Test individual project endpoint
            if len(projects) > 0 and 'slug' in projects[0]:
                slug = projects[0]['slug']
                self.run_test(f"Get Project: {slug}", "GET", f"projects/{slug}", 200)
            else:
                print("⚠️  No projects found or missing slug field")
        
        return success

    def test_partners_endpoints(self):
        """Test partners endpoints"""
        success, partners = self.run_test("Get All Partners", "GET", "partners", 200)
        
        if success and partners:
            # Test individual partner endpoint
            if len(partners) > 0 and 'slug' in partners[0]:
                slug = partners[0]['slug']
                self.run_test(f"Get Partner: {slug}", "GET", f"partners/{slug}", 200)
            else:
                print("⚠️  No partners found or missing slug field")
        
        return success

    def test_articles_endpoints(self):
        """Test articles endpoints"""
        success, articles = self.run_test("Get All Articles", "GET", "articles", 200)
        
        if success and articles:
            # Test individual article endpoint
            if len(articles) > 0 and 'slug' in articles[0]:
                slug = articles[0]['slug']
                self.run_test(f"Get Article: {slug}", "GET", f"articles/{slug}", 200)
            else:
                print("⚠️  No articles found or missing slug field")
        
        return success

    def test_team_endpoint(self):
        """Test team endpoint"""
        return self.run_test("Get Team Members", "GET", "team", 200)

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "company": "Test Company",
            "phone": "+1234567890",
            "service": "trade",
            "message": "This is a test message from automated testing."
        }
        
        return self.run_test("Submit Contact Form", "POST", "contact", 200, data=test_data)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting AICHIN GROUP API Testing...")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)

        # Test all endpoints
        self.test_root_endpoint()
        self.test_services_endpoints()
        self.test_cases_endpoints()
        self.test_events_endpoints()
        self.test_projects_endpoints()
        self.test_partners_endpoints()
        self.test_articles_endpoints()
        self.test_team_endpoint()
        self.test_contact_form()

        # Print results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test['name']}")
                if 'error' in test:
                    print(f"     Error: {test['error']}")
                else:
                    print(f"     Expected: {test['expected']}, Got: {test['actual']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = AichinAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())