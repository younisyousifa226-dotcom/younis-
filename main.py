import urllib.request
import os
import sys
import hashlib

CURRENT_VERSION = "1.0.1"

VERSION_URL = "https://raw.githubusercontent.com/younisyousifa226-dotcom/younis-/main/version.txt"
UPDATE_URL = "https://raw.githubusercontent.com/younisyousifa226-dotcom/younis-/main/main.py"

# جدار الحماية: البصمة الرقمية الفريدة لملفك السليم لمنع الاختراق
EXPECTED_HASH = "3107f5893802a09618dd0b732c208e29b451c5512a5992955dddd01eaee50ad0" 

def check_for_updates():
    print("🛡️ جاري الفحص الأمني والتحقق من التحديثات...")
    try:
        with urllib.request.urlopen(VERSION_URL) as response:
            latest_version = response.read().decode('utf-8').strip()
        
        if latest_version > CURRENT_VERSION:
            print(f"✨ تم العثور على إصدار جديد: {latest_version}")
            
            temp_filename = "temp_main.py"
            urllib.request.urlretrieve(UPDATE_URL, temp_filename)
            
            hasher = hashlib.sha256()
            with open(temp_filename, 'rb') as f:
                buf = f.read()
                hasher.update(buf)
            file_hash = hasher.hexdigest()
            
            print("🔍 يتم الآن فحص بصمة الملف للتأكد من عدم تعديله...")
            
            if file_hash == EXPECTED_HASH:
                filename = os.path.basename(__file__)
                os.replace(temp_filename, filename)
                print("✅ تم التحديث بأمان كامل! البصمة سليمة ومطابقة.")
                sys.exit()
            else:
                os.remove(temp_filename)
                print("🚨 تحذير أمني: تم اكتشاف تلاعب في ملف السيرفر! تم حظر التحديث لحمايتك.")
        else:
            print("🔒 تطبيقك آمن، محدث، ومحمي بالكامل ضد التلاعب.")
            
    except Exception as e:
        print(f"⚠️ فشل الفحص الأمني أو الاتصال: {e}")

if __name__ == "__main__":
    check_for_updates()
    print("\n--- تطبيق يونس المحمي يعمل بنجاح ---")


