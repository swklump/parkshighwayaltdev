from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .models import ALIGN, INT
import pandas as pd
import plotly
from plotly.offline import plot
import plotly.express as px
import plotly.graph_objects as go

email_master = 'sklump@dowl.com'
email_href = 'mailto:' + email_master
allowed_emails = ['sklump@dowl.com']


### HOME PAGE
@csrf_exempt
def home(request):
    if request.method == "POST":
        return redirect('alignment')
    return render(request, 'home.html',  context={'email':email_master, 'email_link':email_href})


### Alignment -------------------------------------------------------------------------------------------------------------
@csrf_exempt
def alignment(request):
    if request.method == "POST":
        email, textinput_var, latlons_var = request.POST['email'], request.POST['textinput'], request.POST['latlons']
        textinput_var = textinput_var.split('_')[:-1]
        latlons_var = latlons_var.split('_')[:-1]
        
        # Parse the data into a dataframe
        df_dict = {'EMAIL':[],'ORDER':[],'LAT':[],'LON':[],'TEXTINPUT':[]}
        for i, e in enumerate(textinput_var):
            df_dict['EMAIL'].append(email)
            df_dict['ORDER'].append(e[:e.find(':')])
            df_dict['LAT'].append(latlons_var[i][latlons_var[i].find(':')+1:latlons_var[i].find(',')])
            df_dict['LON'].append(latlons_var[i][latlons_var[i].find(',')+1:])
            df_dict['TEXTINPUT'].append(e[e.find(':')+1:])
        df = pd.DataFrame(df_dict,columns=['EMAIL','ORDER','LAT','LON','TEXTINPUT'])

        # Send data to db
        for i, e in enumerate(df.values.tolist()):
            reg = ALIGN(EMAIL=df['EMAIL'].iloc[i], ORDER=df['ORDER'].iloc[i], LAT=df['LAT'].iloc[i], LON=df['LON'].iloc[i], TEXTINPUT=df['TEXTINPUT'].iloc[i])
            reg.save()

        return redirect('interchanges')
    return render(request, 'alignment.html',  context={'email':email_master, 'email_link':email_href})


### Interchanges -------------------------------------------------------------------------------------------------------------
@csrf_exempt
def interchanges(request):
    if request.method == "POST":

        email, textinput_var, latlons_var = request.POST['email'], request.POST['textinput'], request.POST['latlons']
        textinput_var = textinput_var.split('_')[:-1]
        latlons_var = latlons_var.split('_')[:-1]
        
        # Parse the data into a dataframe
        df_dict = {'EMAIL':[],'LAT':[],'LON':[],'TEXTINPUT':[]}
        for i, e in enumerate(textinput_var):
            df_dict['EMAIL'].append(email)
            df_dict['LAT'].append(latlons_var[i][latlons_var[i].find(':')+1:latlons_var[i].find(',')])
            df_dict['LON'].append(latlons_var[i][latlons_var[i].find(',')+1:])
            df_dict['TEXTINPUT'].append(e[e.find(':')+1:])
        df = pd.DataFrame(df_dict,columns=['EMAIL','LAT','LON','TEXTINPUT'])

        # Send data to db
        for i, e in enumerate(df.values.tolist()):
            reg = INT(EMAIL=df['EMAIL'].iloc[i], LAT=df['LAT'].iloc[i], LON=df['LON'].iloc[i], TEXTINPUT=df['TEXTINPUT'].iloc[i])
            reg.save()

        return redirect('submitted')
    return render(request, 'interchanges.html',  context={'email':email_master, 'email_link':email_href})


### Submitted Page --------------------------------------------------------------------------------------------
@csrf_exempt
def submitted(request):
    return render(request, 'submitted.html',  context={'email':email_master, 'email_link':email_href})


### Results Page --------------------------------------------------------------------------------------------
@csrf_exempt
def results(request):
    
    df_align = pd.DataFrame(list(ALIGN.objects.values()))
    df_int = pd.DataFrame(list(INT.objects.values()))

    plot_div_align = map_alignment(df_align)
    plot_div_int = map_int(df_int)
    plot_div_table = table_align(df_align)

    return render(request, 'results.html', context={'plot_div_align': plot_div_align, 'plot_div_int': plot_div_int,'plot_div_table': plot_div_table,'email':email_master, 'email_link':email_href})

@csrf_exempt
def error_404(request, exception):
    return render(request, '404.html')


#For results view
def map_alignment(df):
    
    plotly.express.set_mapbox_access_token('pk.eyJ1Ijoic3drbHVtcCIsImEiOiJja3Z4MGk0aTYwaGlrMnBubzYyeXA2bW91In0.UmjBh9eSwNC8BJ0p5MRF-w')
    df = df.sort_values(['EMAIL','ORDER'],ascending=True)
    fig = px.line_mapbox(df, lat="LAT", lon="LON", color="EMAIL",line_group="EMAIL",
    center = {"lat":  61.565, "lon":-149.52}, zoom=10.5,
    mapbox_style="open-street-map",
    hover_data=['ORDER']
    )

    fig.update_traces(line={'width':3})
    fig.update_layout(
        font=dict(
            family="Calibri",
            size=16,
            color="Gray"
        )
    )

    fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
    fig.update_layout(height=500)

    plot_div_align = plot(fig,output_type='div',include_plotlyjs=False, show_link=False, link_text="")
    return plot_div_align

def table_align(df):
    df = df.drop(['id','LAT','LON'],axis=1)
    fig = go.Figure(data=[go.Table(
        header=dict(values=list(df.columns),
                    fill_color='paleturquoise',
                    align='center'),
        cells=dict(values=[df.EMAIL, df.ORDER, df.TEXTINPUT],
                fill_color='white',
                align='center'))
    ])

    # Add filter for email
    fig.update_layout(
        updatemenus=[
            {"buttons": [
                    {"label": c,
                        "method": "update",
                        "args": [{"cells": {"values": df.T.values
                                    if c == "All"
                                    else df.loc[df["EMAIL"].eq(c)].T.values}
                                    }],
                    }
                    for c in ["All"] + df["EMAIL"].unique().tolist()
                ]}])

    fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
    fig.update_layout(height=200)

    plot_div_table = plot(fig,output_type='div',include_plotlyjs=False, show_link=False, link_text="")
    return plot_div_table

def map_int(df):
    
    plotly.express.set_mapbox_access_token('pk.eyJ1Ijoic3drbHVtcCIsImEiOiJja3Z4MGk0aTYwaGlrMnBubzYyeXA2bW91In0.UmjBh9eSwNC8BJ0p5MRF-w')
    fig = px.density_mapbox(df, lat="LAT", lon="LON", radius=10, center = {"lat":  61.565, "lon":-149.52}, zoom=10.5,mapbox_style="open-street-map")

    fig.update_layout(
        font=dict(
            family="Calibri",
            size=16,
            color="Gray"
        )
    )

    fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
    fig.update_layout(height=500)

    plot_div_int = plot(fig,output_type='div',include_plotlyjs=False, show_link=False, link_text="")
    return plot_div_int