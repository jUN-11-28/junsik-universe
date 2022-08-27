from selenium import webdriver

# webdriver을 통해 Chrome 웹 드라이버 객체를 만들어 줌
browser = webdriver.Chrome()

# Chrome 웹 드라이버 객체에게 get을 통하여 네이버의 HTTP 요청을 하게 만듬
browser.get("https://music.youtube.com/browse/VLOLAK5uy_mgryJlILDE846ev_oLUtqPgtKuA92zdBs")