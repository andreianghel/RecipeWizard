#Apache2 Python server 
from __future__ import print_function
from django.shortcuts import render
import time
from django.http import HttpResponse
import smtplib
import MySQLdb

import sys
import os
import xmpp




def mytest(request):
 if request.GET:
  value = request.GET
  form=value['form']
  form = str(form).split("!!")
  
  types = form[0]
 
  #return HttpResponse(rez)
  if types =='c':
	# Open database connection
	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	# prepare a cursor object using cursor() method
	cursor = db.cursor()
	sql = "SELECT name FROM RECIPE ;" 
	try:
	# Execute the SQL command
	 cursor.execute(sql)
	
	 results = cursor.fetchall()
	
	 return HttpResponse(results)
	
	except:
	 db.close()
	 return HttpResponse('xkcd')
  if types =='w':
  	 ingredients  = form[1]
  	
  	 ingredients=ingredients.split("[")
  	 
  	 db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	 cursor = db.cursor()
	 sql = "select rname, rqty, rrecipe, rserving from (select ri.id_recipe as recipe_id, r.name as rname, r.quantity_ingredients as rqty, r.recipe_content as rrecipe, r.serving as rserving from RECIPE r, INGREDIENT i, RECIPE_INGREDIENT ri where r.id=ri.id_recipe and i.id=ri.id_ingredient and (";
	 for row in ingredients:
		row =' i.name="'+row+'" '

	 ingredients= '" or i.name="'.join(ingredients)
	 ingredients='i.name="'+ingredients
	 end = '")) as my_query group by rname order by count(recipe_id) desc';
	 sql=sql+ingredients+end
	# return HttpResponse(sql)
	 try:
	# Execute the SQL command
	  cursor.execute(sql)
	  results = cursor.fetchall()
	  result=""
	  for row in results:
	  	result=result+"!!"+str(row[0])+"!!"+str(row[1])+"!!"+str(row[2])+"!!"+str(row[3])+"&&"
	  return HttpResponse(str(result))
	
	 except: 
	   return HttpResponse( "xkcd")

  	
  if types =='r':
  	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	sql = "SELECT name FROM INGREDIENT ;" 
	try:
	
	 cursor.execute(sql)

	 results = cursor.fetchall()
	
	 return HttpResponse(results)
	
	except:
	 db.close()
	 return HttpResponse('xkcd')
  if types =='h':
  	ingredients  = form[1]
  	
  	ingredients=ingredients.split("[")
  	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	sql = "SELECT id FROM RECIPE where name ='%s' ;" % (ingredients[1],) 
	try:
	 cursor.execute(sql)
	 id_rec = int( cursor.fetchall()[0][0])
	
	except:
	 db.close()
	 return HttpResponse('none found1')

	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	sql = "SELECT id FROM USER where user_name ='%s' ;" % (ingredients[0],) 
	try:
	 cursor.execute(sql)
	 id_usr = int( cursor.fetchall()[0][0])
	
	except:
	 db.close()
	 return HttpResponse('none found2')
	#return HttpResponse(id_usr)
	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	try:
	
	 cursor.execute( "insert into HISTORY (id_user, id_recipe) values (%i, %i);" % (id_usr,id_rec))
	 db.commit()
	
	except:
	 db.close()
	 return HttpResponse('none found3')
	

	return HttpResponse('cool cool cool')

  if types =='y':
  	ingredients  = form[1]
  	
  	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	sql = "SELECT id FROM USER where user_name ='%s' ;" % (ingredients,) 
	try:
	 cursor.execute(sql)
	 id_usr = int( cursor.fetchall()[0][0])
	except:
	 db.close()
	 return HttpResponse('user not found')

  	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	try:
		cursor.execute("""SELECT a.name,a.quantity_ingredients ,a.recipe_content,a.serving FROM `RECIPE` a, `HISTORY` b  WHERE a.id=b.id_recipe and b.id_user = %i """ % (int(id_usr),))
		results = cursor.fetchall()
		result=""
		for row in results:
		 result=result+"!!"+str(row[0])+"!!"+str(row[1])+"!!"+str(row[2])+"!!"+str(row[3])+"&&"
		return HttpResponse(str(result))
	except:
		db.close()
		return HttpResponse('history selector error')
	return HttpResponse('history error')

  if types =='p':
  	ingredients  = form[1]
  	ingredients=ingredients.split("[")

  	db = MySQLdb.connect("localhost","root","udine66798","MySQLtest" )
	cursor = db.cursor()
	try:
	
	 cursor.execute( "insert into USER (USER_NAME,PASS) values (%s, %s);" % (ingredients[0],ingredients[1]))
	 db.commit()
	
	except:
	 db.close()
	 return HttpResponse('insert error')
	return HttpResponse('registration error')
  return HttpResponse('general error')
